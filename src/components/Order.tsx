import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { Feather, AntDesign } from '@expo/vector-icons';

export type OrderProps = {
  id: string;
  patrimony: string;
  when: string;
  status: 'open' | 'closed'
}

type Props = IPressableProps & {
  data: OrderProps;
}

export function Order({ data, ...rest }: Props) {

  const { colors } = useTheme();
  const statusColor = data.status === 'open' ? colors.secondary[700] : colors.green[300];


  return (

    <Pressable {...rest}>
      <HStack
        bg="gray.600"
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        <Box h="full" w={2} bg={statusColor} />

        <VStack flex={1} my={5} ml={5}>
          <Text color="white" fontSize="md">
            Patrimônio: {data.patrimony}
          </Text>
          <HStack alignItems="center">
            <Feather name="clock" color={colors.gray[300]} size={15} />
            <Text color="gray.200" fontSize="xs" ml={1}>
              {data.when}
            </Text>
          </HStack>
        </VStack>
        <Circle bg="gray.500" h={12} w={12} mr={5}>
          {
            data.status === 'closed'
              ? <AntDesign name='checkcircleo' color={statusColor} size={24} />
              : <AntDesign name='hourglass' color={statusColor} size={24} />
          }
        </Circle>
        
      </HStack>
      
    </Pressable>
  );
}