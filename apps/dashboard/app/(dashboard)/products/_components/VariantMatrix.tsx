"use client";

import { useState } from "react";
import {
  IconPlus,
  IconTrash,
  IconChevronDown,
} from "@tabler/icons-react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";

interface AttributeInput {
  name: string;
  values: string[];
}

interface VariantRow {
  attribute_name_1: string;
  attribute_value_1: string;
  attribute_name_2: string;
  attribute_value_2: string;
  sku: string;
  stock_quantity: number;
  price_override: string;
  is_active: boolean;
}

interface VariantMatrixProps {
  onVariantsGenerated: (variants: VariantRow[]) => void;
}

/**
 * Generates the cartesian product of attribute values.
 * e.g. ["Red","Blue"] x ["S","M","L"] → [{v1:"Red",v2:"S"}, ...]
 */
function cartesian(attrs: AttributeInput[]): Array<[string, string, string, string]> {
  if (attrs.length === 0) return [["" , "", "", ""]];
  const first = attrs[0];
  if (attrs.length === 1 && first) {
    return first.values.map((v1) => [first.name, v1, "", ""]);
  }
  const results: Array<[string, string, string, string]> = [];
  const a0 = attrs[0];
  const a1 = attrs[1];
  if (!a0 || !a1) return [];
  for (const v1 of a0.values) {
    for (const v2 of a1.values) {
      results.push([a0.name, v1, a1.name, v2]);
    }
  }
  return results;
}

export function VariantMatrix({ onVariantsGenerated }: VariantMatrixProps) {
  const [attributes, setAttributes] = useState<AttributeInput[]>([
    { name: "", values: [] },
  ]);
  const [valueInput, setValueInput] = useState<Record<number, string>>({});
  const [generatedVariants, setGeneratedVariants] = useState<VariantRow[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const MAX_ATTRIBUTES = 2; // Business rule: max 2 attribute levels
  const MAX_VARIANTS = 25; // Business rule: max 25 variants per product

  const generateVariants = () => {
    const validAttrs = attributes.filter(
      (a) => a.name.trim() && a.values.length > 0,
    );
    if (validAttrs.length === 0) return;

    const combinations = cartesian(validAttrs);
    const variants: VariantRow[] = combinations.slice(0, MAX_VARIANTS).map(
      ([name1, val1, name2, val2]) => ({
        attribute_name_1: name1,
        attribute_value_1: val1,
        attribute_name_2: name2,
        attribute_value_2: val2,
        sku: "",
        stock_quantity: 0,
        price_override: "",
        is_active: true,
      }),
    );

    setGeneratedVariants(variants);
    onVariantsGenerated(variants);
  };

  const addAttribute = () => {
    if (attributes.length < MAX_ATTRIBUTES) {
      setAttributes([...attributes, { name: "", values: [] }]);
    }
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
    setGeneratedVariants([]);
  };

  const updateAttributeName = (index: number, name: string) => {
    const updated = [...attributes];
    const attr = updated[index];
    if (!attr) return;
    updated[index] = { ...attr, name };
    setAttributes(updated);
  };

  const addValue = (attrIndex: number) => {
    const raw = (valueInput[attrIndex] ?? "").trim();
    if (!raw) return;
    const updated = [...attributes];
    const attr = updated[attrIndex];
    if (!attr) return;
    if (!attr.values.includes(raw)) {
      updated[attrIndex] = {
        ...attr,
        values: [...attr.values, raw],
      };
      setAttributes(updated);
    }
    setValueInput((prev) => ({ ...prev, [attrIndex]: "" }));
  };

  const removeValue = (attrIndex: number, value: string) => {
    const updated = [...attributes];
    const attr = updated[attrIndex];
    if (!attr) return;
    updated[attrIndex] = {
      ...attr,
      values: attr.values.filter((v) => v !== value),
    };
    setAttributes(updated);
    setGeneratedVariants([]);
  };

  const updateVariant = (index: number, field: keyof VariantRow, value: unknown) => {
    const updated = [...generatedVariants];
    const row = updated[index];
    if (!row) return;
    updated[index] = { ...row, [field]: value } as VariantRow;
    setGeneratedVariants(updated);
    onVariantsGenerated(updated);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">Variants</h3>
          {generatedVariants.length > 0 && (
            <Badge variant="secondary">{generatedVariants.length}</Badge>
          )}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7">
            <IconChevronDown
              className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col gap-4 mt-4">
          {/* ── Attribute definition ────────────────────────────────── */}
          {attributes.map((attr, attrIndex) => (
            <div key={attrIndex} className="rounded-md border p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Field className="flex-1">
                  <FieldLabel>Attribute name (e.g. Color, Size)</FieldLabel>
                  <Input
                    id={`attr-name-${attrIndex}`}
                    placeholder="Color"
                    value={attr.name}
                    onChange={(e) => updateAttributeName(attrIndex, e.target.value)}
                  />
                </Field>
                {attributes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-end mb-0.5 text-destructive hover:text-destructive"
                    onClick={() => removeAttribute(attrIndex)}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                )}
              </div>

              {/* Values */}
              <div>
                <FieldLabel className="mb-1.5 block text-xs">Values</FieldLabel>
                <div className="flex flex-wrap gap-1 mb-2">
                  {attr.values.map((v) => (
                    <Badge key={v} variant="secondary" className="gap-1">
                      {v}
                      <button
                        type="button"
                        onClick={() => removeValue(attrIndex, v)}
                        className="hover:text-destructive"
                      >
                        <IconTrash className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id={`attr-value-${attrIndex}`}
                    placeholder="Add value (press Enter)"
                    value={valueInput[attrIndex] ?? ""}
                    onChange={(e) =>
                      setValueInput((prev) => ({
                        ...prev,
                        [attrIndex]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValue(attrIndex);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addValue(attrIndex)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add attribute button */}
          {attributes.length < MAX_ATTRIBUTES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAttribute}
              className="self-start"
            >
              <IconPlus data-icon="inline-start" />
              Add Attribute
            </Button>
          )}

          {/* Generate button */}
          <Button
            type="button"
            id="generate-variants-btn"
            onClick={generateVariants}
            disabled={!attributes.some((a) => a.name && a.values.length > 0)}
          >
            Generate Variants
          </Button>

          {/* ── Variant rows ─────────────────────────────────────────── */}
          {generatedVariants.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {generatedVariants.length} variant{generatedVariants.length !== 1 ? "s" : ""} generated
                </p>
                <div className="rounded-md border divide-y">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-muted text-xs font-medium text-muted-foreground">
                    <span>Variant</span>
                    <span>SKU</span>
                    <span>Stock</span>
                    <span>Price Override</span>
                  </div>
                  {generatedVariants.map((variant, i) => {
                    const label = [variant.attribute_value_1, variant.attribute_value_2]
                      .filter(Boolean)
                      .join(" / ");
                    return (
                      <div key={i} className="grid grid-cols-4 gap-2 px-3 py-2 items-center">
                        <span className="text-sm font-medium">{label || "Default"}</span>
                        <Input
                          placeholder="Auto-generated"
                          value={variant.sku}
                          onChange={(e) => updateVariant(i, "sku", e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          min={0}
                          value={variant.stock_quantity}
                          onChange={(e) =>
                            updateVariant(i, "stock_quantity", parseInt(e.target.value) || 0)
                          }
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Same as base"
                          value={variant.price_override}
                          onChange={(e) => updateVariant(i, "price_override", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
