'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StyleTab } from './StyleTab';
import { FieldsTab } from './FieldsTab';
import { InfoTab } from './InfoTab';
import { PermissionsForm } from './PermissionsForm';
import { SaveButton } from './SaveButton';
import { PublishToggle } from './PublishToggle';
import { getAllGroupIds } from '@/config/layers.config';
import type { AdminLayerView, FieldEntry } from '@/types/admin.types';
import type { LayerLegend, LayerPermissions } from '@/types';

interface AdminTabsProps {
  layer: AdminLayerView;
}

const defaultPermissions: LayerPermissions = {
  visibility: 'public',
  allowedCompanies: [],
};

export function AdminTabs({ layer }: AdminTabsProps) {
  const [styleOverrides, setStyleOverrides] = useState<Record<string, unknown>>(layer.style_overrides);
  const [visibleFields, setVisibleFields] = useState<FieldEntry[]>(layer.visible_fields);
  const [metadataOverrides, setMetadataOverrides] = useState<{
    title?: string;
    description?: string;
    citation?: string;
  }>(layer.metadata);
  const [published, setPublished] = useState<boolean>(layer.published);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Dynamic layer specific state
  const [title, setTitle] = useState(layer.title || '');
  const [groupId, setGroupId] = useState('');
  const [legendConfig, setLegendConfig] = useState<LayerLegend>(
    layer.legend_config || { type: 'symbol', items: [{ color: '#3388ff', label: layer.title || 'Feature' }] }
  );
  const [permissionsConfig, setPermissionsConfig] = useState<LayerPermissions>(
    layer.permissions_config || defaultPermissions
  );
  const [defaultOpacity, setDefaultOpacity] = useState(layer.defaultOpacity ?? 1);

  const allGroups = useMemo(() => getAllGroupIds(), []);

  // Extract group_id from the group path on initial load (works for both static and dynamic)
  useEffect(() => {
    const match = allGroups.find((g) => g.path === layer.group || g.id === layer.group);
    setGroupId(match?.id || '');
  }, [layer.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset local state when a different layer is selected
  useEffect(() => {
    setStyleOverrides(layer.style_overrides);
    setVisibleFields(layer.visible_fields);
    setMetadataOverrides({
      title: layer.metadata.title !== layer.defaults.metadata.description ? layer.metadata.title : undefined,
      description: layer.metadata.description !== layer.defaults.metadata.description ? layer.metadata.description : undefined,
      citation: layer.metadata.citation !== layer.defaults.metadata.citation ? layer.metadata.citation : undefined,
    });
    setPublished(layer.published);
    setTitle(layer.title || '');
    setLegendConfig(
      layer.legend_config || { type: 'symbol', items: [{ color: '#3388ff', label: layer.title || 'Feature' }] }
    );
    setPermissionsConfig(layer.permissions_config || defaultPermissions);
    setDefaultOpacity(layer.defaultOpacity ?? 1);
    setSaveStatus('idle');
  }, [layer.id, layer.style_overrides, layer.visible_fields, layer.metadata, layer.defaults.metadata, layer.published, layer.title, layer.legend_config, layer.permissions_config, layer.defaultOpacity]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      // Build save payload
      const body: Record<string, unknown> = {
        style_overrides: styleOverrides,
        visible_fields: visibleFields,
        metadata_overrides: metadataOverrides,
        published,
      };

      // Always include legend, permissions, group and opacity
      body.group_id = groupId || null;
      body.legend_config = legendConfig;
      body.permissions_config = permissionsConfig;
      body.default_opacity = defaultOpacity;

      // For dynamic layers, also include source/type info
      if (layer.is_dynamic) {
        body.is_dynamic = true;
        body.title = title;
        body.layer_type = layer.type;
        body.schema_name = layer.schema;
        body.table_name = layer.table;
        body.vector_style_type = layer.vectorStyleType;
      }

      const res = await fetch(`/api/admin/layers/${layer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Save failed');
        setSaveStatus('error');
      }
    } catch {
      setErrorMessage('Network error');
      setSaveStatus('error');
    }
  }, [layer.id, layer.is_dynamic, layer.type, layer.schema, layer.table, layer.vectorStyleType,
      styleOverrides, visibleFields, metadataOverrides, published,
      title, groupId, legendConfig, permissionsConfig, defaultOpacity]);

  const tabCount = 4;

  return (
    <div className="space-y-6">
      {/* Layer summary */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{
            backgroundColor: layer.type === 'raster' ? '#8b5cf6' : '#10b981',
          }}
        />
        <div>
          <span className="font-medium text-gray-900">{layer.title}</span>
          <span className="text-xs text-gray-500 ml-2">
            {layer.type} {layer.vectorStyleType ? `(${layer.vectorStyleType})` : ''}
          </span>
          {layer.is_dynamic && (
            <span className="text-xs text-indigo-600 ml-2 font-medium">(dynamic)</span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <PublishToggle published={published} onChange={setPublished} />
          <span className="text-xs text-gray-400">{layer.group}</span>
        </div>
      </div>

      {/* Layer config: group + opacity for all, title + source for dynamic only */}
      <div className="space-y-3 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100">
        {layer.is_dynamic && (
          <div>
            <Label className="text-sm font-medium">Layer Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter layer title"
              className="mt-1"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">Group</Label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">No group (Additional Layers)</option>
              {allGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.path}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-medium">Default Opacity</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={Math.round(defaultOpacity * 100)}
                onChange={(e) => setDefaultOpacity(Number(e.target.value) / 100)}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-10 text-right">
                {Math.round(defaultOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>
        {layer.is_dynamic && (
          <div className="text-xs text-gray-500">
            Source: {layer.schema}.{layer.table}
          </div>
        )}
      </div>

      <Tabs defaultValue="style">
        <TabsList className={`grid w-full`} style={{ gridTemplateColumns: `repeat(${tabCount}, 1fr)` }}>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="fields" disabled={layer.type === 'raster'}>
            Fields
          </TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="permissions">Access</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="mt-4">
          <StyleTab
            layer={layer}
            overrides={styleOverrides}
            onChange={setStyleOverrides}
            legend={legendConfig}
            onLegendChange={setLegendConfig}
          />
        </TabsContent>

        <TabsContent value="fields" className="mt-4">
          <FieldsTab
            layer={layer}
            selectedFields={visibleFields}
            onChange={setVisibleFields}
          />
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <InfoTab
            metadata={metadataOverrides}
            defaults={layer.defaults.metadata}
            defaultTitle={layer.title}
            onChange={setMetadataOverrides}
          />
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <PermissionsForm
            permissions={permissionsConfig}
            onChange={setPermissionsConfig}
          />
        </TabsContent>
      </Tabs>

      {/* Save */}
      <div className="pt-4 border-t">
        <SaveButton
          onClick={handleSave}
          status={saveStatus}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
