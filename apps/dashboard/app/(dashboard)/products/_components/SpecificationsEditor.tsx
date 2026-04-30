"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { FieldGroup } from "@repo/ui/components/ui/field";

interface SpecificationsEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: Record<string, any>) => void;
}

export function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  // Common suggestions for product attributes
  const suggestions = ["Color", "Size", "Material", "Brand", "Warranty", "Weight", "Dimensions"];

  const updateSpec = (index: number, key: string, val: string) => {
    const entries = Object.entries(value || {});
    const newEntries = [...entries];
    newEntries[index] = [key, val];
    
    const result: Record<string, any> = {};
    newEntries.forEach(([k, v]) => {
      if (k !== undefined) result[k] = v;
    });
    onChange(result);
  };

  const removeSpec = (index: number) => {
    const entries = Object.entries(value || {});
    const newEntries = entries.filter((_, i) => i !== index);
    
    const result: Record<string, any> = {};
    newEntries.forEach(([k, v]) => {
      result[k] = v;
    });
    onChange(result);
  };

  const addSpec = (key: string = "") => {
    // To allow multiple "empty" keys during editing, we'd need local state.
    // For now, we just append a unique identifier if the key already exists.
    let finalKey = key;
    if (finalKey && finalKey in (value || {})) {
      finalKey = `${finalKey} (new)`;
    } else if (!finalKey) {
      // If adding an empty key, we need to make it unique if there's already an empty one
      let emptyKey = "";
      while (emptyKey in (value || {})) {
        emptyKey += " ";
      }
      finalKey = emptyKey;
    }
    
    onChange({ ...value, [finalKey]: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-muted-foreground">
          Suggestions
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs rounded-full border-dashed"
              onClick={() => addSpec(s)}
            >
              <IconPlus className="size-3 mr-1" />
              {s}
            </Button>
          ))}
        </div>
      </div>

      {Object.keys(value || {}).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
          <p className="text-sm">No specifications added yet.</p>
          <Button type="button" variant="link" onClick={() => addSpec()} className="mt-2">
            <IconPlus className="size-4 mr-2" />
            Add first attribute
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_2fr_40px] gap-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            <div>Attribute</div>
            <div>Value</div>
            <div />
          </div>
          <FieldGroup>
            {Object.entries(value || {}).map(([k, v], index) => (
              <div key={index} className="grid grid-cols-[1fr_2fr_40px] gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                <Input
                  placeholder="e.g. Color"
                  value={k.trim()}
                  onChange={(e) => updateSpec(index, e.target.value, String(v))}
                  className="bg-background shadow-sm"
                />
                <Input
                  placeholder="e.g. Red, Blue, Green"
                  value={String(v)}
                  onChange={(e) => updateSpec(index, k, e.target.value)}
                  className="bg-background shadow-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSpec(index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <IconTrash className="size-4" />
                </Button>
              </div>
            ))}
          </FieldGroup>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            onClick={() => addSpec()} 
            className="w-fit mt-2 font-medium"
          >
            <IconPlus className="size-4 mr-2" />
            Add Custom Attribute
          </Button>
        </div>
      )}
    </div>
  );
}
