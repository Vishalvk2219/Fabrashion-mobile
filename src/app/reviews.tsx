import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors, productTones } from '@/theme/colors';

const BARS = [
  { star: 5, pct: 82 },
  { star: 4, pct: 12 },
  { star: 3, pct: 4 },
  { star: 2, pct: 2 },
  { star: 1, pct: 1 },
];
const FILTERS = ['All', '5 ★', '4 ★', 'With Photos'];
const REVIEWS = [
  {
    initial: 'R',
    name: 'Riya S.',
    meta: 'Verified · 2 days ago',
    rating: '5.0',
    text: 'Exquisite fabric and the fit is perfect. The Try at Home service made choosing the right size effortless.',
    photos: [productTones[0], productTones[1]],
  },
  {
    initial: 'M',
    name: 'Meera K.',
    meta: 'Verified · 1 week ago',
    rating: '4.0',
    text: "Beautiful drape and true to the photos. Sizing runs slightly large — I'd size down.",
    photos: [],
  },
];

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Ratings & Reviews
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.summary}>
          <View style={styles.score}>
            <Text serif weight="700" size={48} style={{ lineHeight: 50 }}>
              4.8
            </Text>
            <View style={styles.starRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={14} fill color={colors.accent} />
              ))}
            </View>
            <Text size={11} muted style={{ marginTop: 5 }}>
              214 reviews
            </Text>
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            {BARS.map((b) => (
              <View key={b.star} style={styles.barRow}>
                <Text size={11} muted style={{ width: 8 }}>
                  {b.star}
                </Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${b.pct}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  active ? { backgroundColor: colors.primary } : { borderWidth: 1.5, borderColor: colors.border },
                ]}>
                <Text weight="600" size={12} color={active ? colors.onPrimary : colors.label2}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoStrip}>
          {[productTones[0], productTones[1], productTones[3], productTones[4]].map((tone, i) => (
            <View key={i} style={[styles.photo, { backgroundColor: tone }]}>
              {i === 3 ? (
                <View style={styles.photoOverlay}>
                  <Text weight="700" size={13} color={colors.white}>
                    +48
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>

        {REVIEWS.map((r) => (
          <View key={r.name} style={styles.review}>
            <View style={styles.reviewer}>
              <View style={styles.avatar}>
                <Text weight="700" size={12}>
                  {r.initial}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text weight="600" size={13}>
                  {r.name}
                </Text>
                <Text size={10} color={colors.faint}>
                  {r.meta}
                </Text>
              </View>
              <View style={styles.ratingChip}>
                <Icon name="star" size={12} fill color={colors.accent} />
                <Text weight="700" size={11}>
                  {r.rating}
                </Text>
              </View>
            </View>
            <Text size={13} color={colors.label2} style={styles.reviewText}>
              {r.text}
            </Text>
            {r.photos.length ? (
              <View style={styles.reviewPhotos}>
                {r.photos.map((tone, i) => (
                  <View key={i} style={[styles.reviewPhoto, { backgroundColor: tone }]} />
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
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
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  summary: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 18,
    borderCurve: 'continuous',
  },
  score: { alignItems: 'center' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3 },
  barFill: { height: 6, backgroundColor: colors.accent, borderRadius: 3 },
  filters: { gap: 10, paddingVertical: 18 },
  filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  photoStrip: { gap: 8, paddingBottom: 18 },
  photo: { width: 76, height: 76, borderRadius: 12, borderCurve: 'continuous' },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(20,18,14,0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  review: { paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.surface },
  reviewer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accentSoft,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  reviewText: { marginTop: 10, lineHeight: 21 },
  reviewPhotos: { flexDirection: 'row', gap: 8, marginTop: 10 },
  reviewPhoto: { width: 56, height: 56, borderRadius: 10 },
});
