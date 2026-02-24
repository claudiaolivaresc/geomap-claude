'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { LayerPermissions } from '@/types';
import type { Company } from '@/types/company.types';

interface PermissionsFormProps {
  permissions: LayerPermissions;
  onChange: (permissions: LayerPermissions) => void;
}

export function PermissionsForm({ permissions, onChange }: PermissionsFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleVisibilityChange = (restricted: boolean) => {
    onChange({
      ...permissions,
      visibility: restricted ? 'restricted' : 'public',
      allowedCompanies: restricted ? permissions.allowedCompanies : [],
    });
  };

  const handleCompanyToggle = (companyId: string, checked: boolean) => {
    const current = permissions.allowedCompanies || [];
    const updated = checked
      ? [...current, companyId]
      : current.filter((id) => id !== companyId);
    onChange({ ...permissions, allowedCompanies: updated });
  };

  return (
    <div className="space-y-4">
      {/* Visibility toggle */}
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        <Checkbox
          id="restricted"
          checked={permissions.visibility === 'restricted'}
          onCheckedChange={handleVisibilityChange}
        />
        <div>
          <Label htmlFor="restricted" className="font-medium cursor-pointer">
            Restrict to specific companies
          </Label>
          <p className="text-xs text-gray-500">
            When enabled, only users from selected companies (and admins) can see this layer
          </p>
        </div>
      </div>

      {/* Company checkboxes (only visible when restricted) */}
      {permissions.visibility === 'restricted' && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Allowed Companies
          </Label>
          {loading ? (
            <p className="text-sm text-gray-400">Loading companies...</p>
          ) : companies.length === 0 ? (
            <p className="text-sm text-gray-400">
              No companies created yet. Add companies in the Companies tab.
            </p>
          ) : (
            <div className="space-y-2">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <Checkbox
                    id={`company-${company.id}`}
                    checked={permissions.allowedCompanies?.includes(company.id) ?? false}
                    onCheckedChange={(checked) =>
                      handleCompanyToggle(company.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`company-${company.id}`} className="cursor-pointer">
                    {company.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
