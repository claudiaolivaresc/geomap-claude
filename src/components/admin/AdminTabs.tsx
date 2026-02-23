'use client';

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleTab } from './StyleTab';
import { FieldsTab } from './FieldsTab';
import { InfoTab } from './InfoTab';
import { SaveButton } from './SaveButton';
import { PublishToggle } from './PublishToggle';
import type { AdminLayerView } from '@/types/admin.types';

interface AdminTabsProps {
  layer: AdminLayerView;
}

export function AdminTabs({ layer }: AdminTabsProps) {
  const [styleOverrides, setStyleOverrides] = useState<Record<string, unknown>>(layer.style_overrides);
  const [visibleFields, setVisibleFields] = useState<string[]>(layer.visible_fields);
  const [metadataOverrides, setMetadataOverrides] = useState<{
    title?: string;
    description?: string;
    citation?: string;
  }>(layer.metadata);
  const [published, setPublished] = useState<boolean>(layer.published);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
    setSaveStatus('idle');
  }, [layer.id, layer.style_overrides, layer.visible_fields, layer.metadata, layer.defaults.metadata, layer.published]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      const res = await fetch(`/api/admin/layers/${layer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style_overrides: styleOverrides,
          visible_fields: visibleFields,
          metadata_overrides: metadataOverrides,
          published,
        }),
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
  }, [layer.id, styleOverrides, visibleFields, metadataOverrides, published]);

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
        </div>
        <div className="ml-auto flex items-center gap-2">
          <PublishToggle published={published} onChange={setPublished} />
          <span className="text-xs text-gray-400">{layer.group}</span>
        </div>
      </div>

      <Tabs defaultValue="style">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="fields" disabled={layer.type === 'raster'}>
            Fields
          </TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="mt-4">
          <StyleTab
            layer={layer}
            overrides={styleOverrides}
            onChange={setStyleOverrides}
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
