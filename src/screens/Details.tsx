import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { VStack, Text, HStack, useTheme, ScrollView, Box } from 'native-base';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';



type RouteParams = {
  orderId: string;
}

type OrderDatails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {

  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDatails>({} as OrderDatails);

  const { colors } = useTheme();

  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  const navigation = useNavigation();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Digite a solução para encerrar a solicitação')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada.')
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação.')
      });


  }



  useEffect(() => {
    const subscriber = firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed
        });

        setIsLoading(false);

      })

  }, []);

  if (isLoading) {
    return <Loading />
  }


  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title='solicitação' />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <AntDesign name='checkcircleo' color={colors.green[300]} size={22} />
            : <AntDesign name='hourglass' color={colors.secondary[700]} size={22} />
        }
        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>

      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title='equipamento'
          description={`Patrimônio ${order.patrimony}`}
          iconName="monitor"          
        />
        <CardDetails
          title='descrição do problema'
          description={order.description}
          iconName="clipboard"
          footer={`Registrado em ${order.when}`}
        />
        <CardDetails
          title='solução'
          iconName="check-circle"
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              placeholder='Descrição da solução'
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          }
        </CardDetails>
      </ScrollView>
      {
        order.status === 'open' &&
        <Button
          title='Encerrar Solicitação'
          m={5}
          onPress={handleOrderClose}
        />
      }


    </VStack>
  );
}