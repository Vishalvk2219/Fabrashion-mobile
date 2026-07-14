import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { useCreateProduct } from '@/features/admin/hooks';
import { useCategories } from '@/features/catalog/hooks';
import type { Department } from '@/features/catalog/schema';
import { fontFamily } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

const DEPARTMENTS: Department[] = ['WOMEN', 'MEN', 'UNISEX', 'KIDS'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
// Illustrative colour presets (product content, not theme).
const COLOURS = [
  { name: 'Ivory', hex: '#F5F5F0' },
  { name: 'Ink', hex: '#101010' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Navy', hex: '#1F2A44' },
  { name: 'Blush', hex: '#E8B4B8' },
];

/** New Product — the real catalog write path (`POST /admin/products`). */
export default function AdminAddProduct() {
  const insets = useSafeAreaInsets();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories();
  // Products attach to leaf categories (e.g. "Men · Shirts").
  const leaves = (categories ?? []).filter((c) => c.parentId !== null);
  const parentName = (id: string | null) => (categories ?? []).find((c) => c.id === id)?.name;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [department, setDepartment] = useState<Department>('WOMEN');
  const [priceRupees, setPriceRupees] = useState('');
  const [mrpRupees, setMrpRupees] = useState('');
  const [sizes, setSizes] = useState<string[]>(['M']);
  const [colour, setColour] = useState(COLOURS[0]!);
  const [openingQty, setOpeningQty] = useState('10');
  const [trialEligible, setTrialEligible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const submit = () => {
    setError(null);
    const price = Math.round(Number(priceRupees) * 100);
    const mrp = Math.round(Number(mrpRupees || priceRupees) * 100);
    if (name.trim().length < 2) return setError('Give the product a name.');
    if (!description.trim()) return setError('Add a short description.');
    if (!categoryId) return setError('Pick a category.');
    if (!Number.isFinite(price) || price <= 0) return setError('Enter a selling price.');
    if (mrp < price) return setError('MRP can’t be below the selling price.');
    if (sizes.length === 0) return setError('Select at least one size.');

    createProduct.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        categoryId,
        department,
        brand: brand.trim() || undefined,
        trialEligible,
        initialWarehouseQty: Math.max(0, Number(openingQty) || 0),
        variants: sizes.map((size) => ({
          size,
          colorName: colour.name,
          colorHex: colour.hex,
          pricePaise: price,
          mrpPaise: mrp,
        })),
      },
      {
        onSuccess: () => router.back(),
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'Could not reach the server. Try again.'),
      },
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          New Product
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <FieldLabel>Product Name</FieldLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Silk Slip Dress"
          placeholderTextColor={colors.faint}
          style={[styles.input, styles.inputStrong]}
        />

        <FieldLabel>Description</FieldLabel>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Fabric, cut, and what makes it special"
          placeholderTextColor={colors.faint}
          multiline
          style={[styles.input, styles.inputMultiline]}
        />

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Brand Line</FieldLabel>
            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="Atelier"
              placeholderTextColor={colors.faint}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>Opening stock / size</FieldLabel>
            <TextInput
              value={openingQty}
              onChangeText={(t) => setOpeningQty(t.replace(/\D/g, '').slice(0, 5))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.faint}
              style={styles.input}
            />
          </View>
        </View>

        <FieldLabel>Category</FieldLabel>
        <View style={styles.chips}>
          {leaves.map((c) => {
            const active = c.id === categoryId;
            const parent = parentName(c.parentId);
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {parent ? `${parent} · ${c.name}` : c.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>Department</FieldLabel>
        <View style={styles.chips}>
          {DEPARTMENTS.map((d) => {
            const active = d === department;
            return (
              <Pressable
                key={d}
                onPress={() => setDepartment(d)}
                style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Price (₹)</FieldLabel>
            <TextInput
              value={priceRupees}
              onChangeText={(t) => setPriceRupees(t.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.faint}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>MRP (₹)</FieldLabel>
            <TextInput
              value={mrpRupees}
              onChangeText={(t) => setMrpRupees(t.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="same as price"
              placeholderTextColor={colors.faint}
              style={styles.input}
            />
          </View>
        </View>

        <FieldLabel>Sizes</FieldLabel>
        <View style={styles.chips}>
          {SIZES.map((s) => {
            const active = sizes.includes(s);
            return (
              <Pressable
                key={s}
                onPress={() => toggleSize(s)}
                style={[styles.sizeBox, active && styles.sizeBoxActive]}>
                <Text size={12} weight="700" color={active ? colors.accent : colors.label2}>
                  {s}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>{`Colour · ${colour.name}`}</FieldLabel>
        <View style={styles.swatches}>
          {COLOURS.map((c) => (
            <Pressable
              key={c.hex}
              onPress={() => setColour(c)}
              style={[styles.swatch, { backgroundColor: c.hex }, c.hex === colour.hex && styles.swatchActive]}
            />
          ))}
        </View>

        <View style={styles.trialRow}>
          <Icon name="checkroom" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text size={14} weight="600">
              Try-at-home eligible
            </Text>
            <Text size={11} color={colors.muted} style={{ marginTop: 1 }}>
              Customers can book this piece for a home trial
            </Text>
          </View>
          <Toggle value={trialEligible} onChange={() => setTrialEligible((v) => !v)} />
        </View>

        <View style={styles.info}>
          <Icon name="info" size={22} color={colors.accent} />
          <Text size={12} color={colors.label2} style={{ flex: 1, lineHeight: 18 }}>
            The product goes live in the customer catalogue immediately, stocked at the main warehouse.
          </Text>
        </View>

        {error ? (
          <Text size={12.5} color={colors.dangerFg} style={{ marginTop: 12 }}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.cta, createProduct.isPending && { opacity: 0.6 }]}
          disabled={createProduct.isPending}
          onPress={submit}>
          <Text size={15} weight="600" color={colors.onPrimary}>
            {createProduct.isPending ? 'Publishing…' : 'Publish Product'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text uppercase size={11} track={0.1} color={colors.muted2} style={styles.fieldLabel}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  fieldLabel: { marginBottom: 6 },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: fontFamily.sansMedium,
    color: colors.label,
    marginBottom: 16,
  },
  inputStrong: { borderColor: colors.borderStrong },
  inputMultiline: { minHeight: 84, paddingTop: 14, textAlignVertical: 'top' },
  twoCol: { flexDirection: 'row', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipIdle: { backgroundColor: colors.background, borderColor: colors.border },
  sizeBox: {
    width: 52,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
  },
  sizeBoxActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  swatches: { flexDirection: 'row', gap: 12, marginBottom: 18, alignItems: 'center' },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  swatchActive: { borderWidth: 2.5, borderColor: colors.accent },
  trialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.officeCanvas,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 14,
    marginBottom: 12,
  },
  info: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.officeCanvas,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 14,
  },
  footer: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingHorizontal: 16, paddingTop: 12 },
  cta: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
