import { StyleSheet, Text, View } from 'react-native';

interface ClapperboardLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export default function ClapperboardLogo({ size = 'medium', showText = true, style }: ClapperboardLogoProps) {
  const logoSizes = {
    small: { width: 60, height: 45, fontSize: 14 },
    medium: { width: 100, height: 75, fontSize: 20 },
    large: { width: 140, height: 105, fontSize: 28 },
  };

  const currentSize = logoSizes[size];

  return (
    <View style={[styles.container, style]}>
      {/* Cinema Clapperboard Icon */}
      <View style={[styles.logoContainer, {
        width: currentSize.width,
        height: currentSize.height
      }]}>
        {/* Main clapperboard body */}
        <View style={[styles.clapperboard, {
          width: currentSize.width,
          height: currentSize.height * 0.7
        }]}>
          {/* Film strips on top */}
          <View style={[styles.filmStrips, { height: currentSize.height * 0.3 }]}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={[styles.filmStrip, {
                width: currentSize.width / 8,
                height: currentSize.height * 0.2
              }]} />
            ))}
          </View>

          {/* Clapperboard base */}
          <View style={styles.clapperboardBase} />
        </View>

        {/* Top clapper part */}
        <View style={[styles.clapperTop, {
          width: currentSize.width * 0.9,
          height: currentSize.height * 0.15,
          top: -currentSize.height * 0.05
        }]}>
          {/* Black and white strips on clapper */}
          <View style={styles.clapperStrips}>
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.clapperStrip,
                  {
                    backgroundColor: i % 2 === 0 ? '#000' : '#fff',
                    width: currentSize.width / 8
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {showText && (
        <Text style={[styles.appName, { fontSize: currentSize.fontSize }]}>
          Binge It
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clapperboard: {
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#a00909d4', // Red border like the image
    overflow: 'hidden',
    shadowColor: '#740606ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filmStrips: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  filmStrip: {
    backgroundColor: '#000',
    borderRadius: 2,
  },
  clapperboardBase: {
    flex: 1,
    backgroundColor: '#000',
  },
  clapperTop: {
    position: 'absolute',
    backgroundColor: '#dc2626',
    borderRadius: 6,
    transform: [{ rotate: '-8deg' }],
    borderWidth: 2,
    borderColor: '#b91c1c',
    overflow: 'hidden',
  },
  clapperStrips: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clapperStrip: {
    height: '80%',
    marginHorizontal: 1,
  },
  appName: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 15,
    letterSpacing: 1,
  },
});