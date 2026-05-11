import { motion } from 'framer-motion';
import { Image, ImageProps, Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  /** Aspect ratio to prevent layout shift (e.g., "16/9", "1", "4/3") */
  aspectRatio?: string;
  /** Skeleton background color */
  skeletonBg?: string;
  /** Shimmer effect color */
  shimmerColor?: string;
}

/**
 * OptimizedImage - Image component with skeleton shimmer loading state and fade-in animation.
 * 
 * Features:
 * - Pulsing shimmer skeleton while loading
 * - Smooth fade-in transition when image loads
 * - Prevents layout shift with aspect ratio container
 * - Preserves all native Image props including alt text
 * 
 * @example
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   aspectRatio="16/9"
 *   w="100%"
 * />
 */
const OptimizedImage = ({
  aspectRatio,
  skeletonBg = '#f0f0f0',
  shimmerColor = 'rgba(255, 255, 255, 0.4)',
  style,
  ...imageProps
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Box
      position="relative"
      w="100%"
      {...(aspectRatio && {
        sx: {
          aspectRatio: aspectRatio.replace('/', '/'),
        },
      })}
      overflow="hidden"
      borderRadius={imageProps.borderRadius || 'inherit'}
    >
      {/* Skeleton Shimmer - shown while loading */}
      {!isLoaded && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg={skeletonBg}
          overflow="hidden"
          zIndex={1}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: `linear-gradient(
                90deg,
                transparent 0%,
                ${shimmerColor} 50%,
                transparent 100%
              )`,
            }}
          />
        </Flex>
      )}

      {/* Actual Image - fades in when loaded */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          width: '100%',
          height: '100%',
          position: aspectRatio ? 'absolute' : 'relative',
          top: 0,
          left: 0,
        }}
      >
        <Image
          {...imageProps}
          onLoad={handleLoad}
          style={{
            ...style,
            width: '100%',
            height: '100%',
            objectFit: imageProps.objectFit || 'cover',
          }}
        />
      </motion.div>
    </Box>
  );
};

export default OptimizedImage;