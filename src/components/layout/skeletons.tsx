import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Shimmer } from '@/components/ui/skeleton';
import { colors } from '@/theme/colors';

const BASE = '#EFECE5';

/** Static (non-shimmering) grey bar for small text lines. */
function Bar({ w, h = 12, style }: { w: number | `${number}%`; h?: number; style?: object }) {
  return <View style={[{ width: w, height: h, borderRadius: 4, backgroundColor: BASE }, style]} />;
}

function GridCard() {
  return (
    <View style={{ flex: 1 }}>
      <Shimmer style={styles.gridImage} />
      <Bar w="60%" style={{ marginBottom: 6 }} />
      <Bar w="40%" />
    </View>
  );
}

export function HomeSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 10 }]}>
      <Shimmer style={styles.search} />
      <Shimmer style={styles.hero} />
      <View style={styles.circles}>
        {[0, 1, 2, 3].map((i) => (
          <Shimmer key={i} style={styles.circle} />
        ))}
      </View>
      <Shimmer style={styles.sectionTitle} />
      <View style={styles.grid}>
        <GridCard />
        <GridCard />
      </View>
    </View>
  );
}

export function ListingSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Shimmer style={styles.listTitle} />
      <View style={styles.chips}>
        <Shimmer style={[styles.chip, { width: 80 }]} />
        <Shimmer style={[styles.chip, { width: 70 }]} />
        <Shimmer style={[styles.chip, { width: 64 }]} />
      </View>
      <View style={styles.grid}>
        <GridCard />
        <GridCard />
      </View>
      <View style={[styles.grid, { marginTop: 18 }]}>
        <GridCard />
        <GridCard />
      </View>
    </View>
  );
}

export function PdpSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.pdpRoot}>
      <Shimmer style={styles.pdpImage} />
      <View style={[styles.pdpBody, { paddingTop: 20 }]}>
        <Bar w="30%" h={10} style={{ marginBottom: 12 }} />
        <Shimmer style={styles.pdpTitle} />
        <Shimmer style={styles.pdpPrice} />
        <View style={styles.pdpSwatches}>
          {[0, 1, 2, 3].map((i) => (
            <Shimmer key={i} style={styles.pdpSwatch} />
          ))}
        </View>
        <Shimmer style={styles.pdpCard} />
        <Shimmer style={[styles.pdpCard, { marginTop: 12 }]} />
      </View>
      {/* keep the top inset spacer so the image bleeds under the status bar like the real PDP */}
      <View style={{ position: 'absolute', top: 0, height: insets.top }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  search: { height: 48, borderRadius: 14, marginVertical: 14 },
  hero: { height: 172, borderRadius: 22, marginBottom: 22 },
  circles: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  circle: { width: 62, height: 62, borderRadius: 31 },
  sectionTitle: { height: 22, width: 150, borderRadius: 6, marginBottom: 16 },
  grid: { flexDirection: 'row', gap: 14 },
  gridImage: { height: 200, borderRadius: 18, marginBottom: 8 },
  listTitle: { height: 24, width: 180, borderRadius: 6, marginVertical: 12 },
  chips: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  chip: { height: 38, borderRadius: 20 },
  pdpRoot: { flex: 1, backgroundColor: colors.background },
  pdpImage: { height: 460, borderRadius: 0 },
  pdpBody: { paddingHorizontal: 20 },
  pdpTitle: { height: 30, width: '70%', borderRadius: 6, marginBottom: 12 },
  pdpPrice: { height: 22, width: '40%', borderRadius: 6, marginBottom: 20 },
  pdpSwatches: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pdpSwatch: { width: 40, height: 40, borderRadius: 20 },
  pdpCard: { height: 60, borderRadius: 16 },
});
