import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const DisplayExpense = () => {
  const [purchase, setPurchase] = useState([
    { category: '', amount: '', paymentMethod: ''}
  ])
  return (
    <View>
      <Text>DisplayExpense</Text>
    </View>
  )
}

export default DisplayExpense
