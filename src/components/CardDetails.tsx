import React, { ReactNode } from 'react';

import { Feather,createMultiStyleIconSet } from '@expo/vector-icons';
import { VStack, HStack, Text, Box, useTheme } from 'native-base';

type Props = {
  title: string;
  description?: string;
  footer?: string;
  iconName: string;
  children?: ReactNode;
}


export function CardDetails({
  title,
  description,
  footer = null,
  iconName,
  children
}: Props) {

  const {colors} = useTheme()

  return (
    <VStack bg="gray.600" p={5} mt={5} rounded='sm'>
      <HStack alignItems="center" mb={4}>
        
        { iconName === 'monitor' &&
          <Feather name="monitor"  color={colors.primary[700]} size={20}/>
        }
        { iconName === 'clipboard' &&
          <Feather name="clipboard"  color={colors.primary[700]} size={20}/>
        } 
        { iconName === 'check-circle' &&
          <Feather name="check-circle"  color={colors.primary[700]} size={20}/>
        }   

        <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
          {title}
        </Text>
      </HStack>

      {
        !!description && 
        <Text color="gray.100" fontSize="md">
          {description}
        </Text> 
      }
      { children }
      {
        !!footer &&
        <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
          <Text mt={3} color="gray.300" fontSize="sm">
            {footer}
          </Text>
        </Box>
      }
    </VStack>
  );
}