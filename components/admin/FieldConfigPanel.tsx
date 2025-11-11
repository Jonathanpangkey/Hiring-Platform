"use client";

import {FieldConfig, FieldValidation} from "@/app/types/jobType";
import {cn} from "@/lib/utils";

interface FieldConfigPanelProps {
  fields: FieldConfig[];
  onFieldChange: (fieldKey: string, validation: FieldValidation) => void;
}

export default function FieldConfigPanel({fields, onFieldChange}: FieldConfigPanelProps) {
  const ValidationButton = ({isActive, label, onClick, className}: {isActive: boolean; label: string; onClick: () => void; className?: string}) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer border";

    const activeClasses = "bg-transparent text-primary-700 border-primary-700";
    const inactiveClasses = "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";

    return (
      <button type='button' onClick={onClick} className={cn(baseClasses, isActive ? activeClasses : inactiveClasses, className)}>
        {label}
      </button>
    );
  };

  return (
    <div className='space-y-3 p-4 rounded-lg border border-gray-200'>
      <label className='block text-sm font-medium mb-3'>Minimum Profile Information Required</label>
      {fields.map((field) => (
        <div key={field.key} className='flex items-center justify-between py-2 px-3 bg-white rounded border-b border-gray-200'>
          <span className='text-sm font-medium text-gray-700'>{field.label}</span>

          <div className='flex items-center gap-2'>
            <ValidationButton isActive={field.validation === "mandatory"} label='Mandatory' onClick={() => onFieldChange(field.key, "mandatory")} />
            <ValidationButton isActive={field.validation === "optional"} label='Optional' onClick={() => onFieldChange(field.key, "optional")} />
            <ValidationButton isActive={field.validation === "off"} label='Off' onClick={() => onFieldChange(field.key, "off")} />
          </div>
        </div>
      ))}
    </div>
  );
}
