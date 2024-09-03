import React, {useEffect, useRef, useState} from 'react';
import { Drawer } from 'expo-router/drawer'
import DropdownComponent from '../../../../partials/DropdownComponent';
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet';
import { upLoadExpense } from '../../../../lib/appwrite'
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useGlobalContext } from '../../../../context/GlobalProvider';
import TextField from '../../../../components/TextField'
import CustomButton from '../../../../components/CustomButton';

const AddExpense = () => {
  const sheet = useRef();
  const {user } = useGlobalContext()


  const [transactionType, setTransactionType] = useState("Expense");
  const [showDateBtn, setShowDateBtn] = useState(false)
  const [datePlaceholder, setDatePlaceholder] = useState("Date")
  const [pressed, setPressed] = useState(false);
  const [ date, setDate ] = useState(new Date())
  const [showDropdown, setShowDownDrop] = useState(false)
  const [formReady, setFormReady] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)  

  const [hasTypedExpense, setHasTypedExpense] = useState(false);
  const [hasTypedIncome, setHasTypedIncome] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    item: "",
    description: "",
    category: "",
    amount: 0.0,
    type: "",
    dateOfPurchase: "",
    paymentMode: "",
  });

  const [incomeForm, setIncomeForm] = useState({
    description: "",
    category: "",
    amount: 0.0,
    type: "",
    dateOfPurchase: "",
    paymentMode: "",
  });

  const handleTextChangeExpense = (e) => {
    setHasTypedExpense(true);
    expenseForm.category = categoryValue
    setExpenseForm((prevForm) => ({ ...prevForm, category: e }));

    if (expenseForm.category !== 'none') {
      expenseForm.category = ""
    }
  };

  const handleTextChangeIncome = (e) => {
    setHasTypedIncome(true);
    incomeForm.category = categoryValue
    setIncomeForm((prevForm) => ({ ...prevForm, category: e }));
  };

  const isExpenseTab = transactionType === 'Expense';
  const categoryValue = isExpenseTab ? expenseForm.category : incomeForm.category;
  const hasTyped = isExpenseTab ? hasTypedExpense : hasTypedIncome;

  const submit = async () => {
    const form = transactionType === 'Expense' ? expenseForm : incomeForm;
    if (transactionType === 'Expense') {
      form.type = transactionType
      if (form.item === "" || form.amount === "" || form.category === "" || form.dateOfPurchase === "" || form.paymentMode === "" || form.description === "" || form.type === "") {
        return Alert.alert("Error", "Please fill in all the fields - Expense")
      }
    } else if (transactionType === 'Income'){
      form.type = transactionType
      form.item = form.description
      if (form.item === "" || !form.amount || form.category === "" || form.dateOfPurchase === "" || form.paymentMode === "" || form.description === "" || form.type === "") {
        return Alert.alert("Error", "Please fill in all the fields - Income")
      }
    }
   
    setIsSubmitting(true)

    try {

      await upLoadExpense(form.item, form.description, form.category, parseFloat(form.amount), form.type, form.dateOfPurchase, form.paymentMode, user?.$id)

      if (transactionType === "Expense") {
        return Alert.alert("Success", "You've successfully added to your expenses")

      } else {
        return Alert.alert("Success", "You've successfully added to your incomes")

      }

    
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setExpenseForm({
        item: "",
        description: "",
        category: "",
        amount: 0.0,
        type: "",
        dateOfPurchase: "",
        paymentMode: "",
      });
      setIncomeForm({
        description: "",
        category: "",
        amount: 0.0,
        type: "",
        dateOfPurchase: "",
        paymentMode: "",
      });
      setIsSubmitting(false)
    }
  }
  const onChange = ({type}, dateOfPurchase) => {
    if(type=="set") {
      setDate(dateOfPurchase)
    }
  }

 useEffect(() => {
  const form = transactionType === 'Expense' ? expenseForm : incomeForm;
   setFormReady(form.item && form.amount && form.dateOfPurchase && form.category && form.paymentMode);
   return () => {
     setFormReady(false)
   }
 }, [expenseForm, incomeForm, transactionType])


  return (
    <>
    <Drawer.Screen 
      options={{
        headerShown: false,
        gestureEnabled: false,  
        drawerStyle: {
          backgroundColor: '#fff'
        }    
    }}
    />
    <View className="mx-1 items-center bg-white pb-2">
      <Text className="text-center pt-20 font-pbold text-4xl text-[#1F41BB]">Add Transaction</Text>
      {/* Toggle between these two tabs cz user must be prevented from entering data (income) in the expense textBox */}
      <SegmentedControl
          values={["Expense", "Income"]}
          style={{ width: 300, marginTop: 15, marginBottom: 10, alignSelf: 'center' }}
          selectedIndex={transactionType === "Expense" ? 0 : 1}
          onChange={(event) => {
            const index = event.nativeEvent.selectedSegmentIndex;
            setTransactionType(index === 0 ? "Expense" : "Income");
          }}
          tabStyle={{ }}
        />
      </View>
    <ScrollView>
    <View className="">
      <View className="mx-3 mt-[50px] rounded-lg">
      {transactionType === "Expense" && (
            <>
              <TextField
                value={expenseForm.item}
                placeholder='Money spent on'
                placeholderTextColor="#9DA0A7"
                handleTextChange={(e) => setExpenseForm({...expenseForm, item: e})}
                otherStyles='mb-5 -mt-2'
              />
              <TextField
                value={expenseForm.description}
                placeholder='Description'
                placeholderTextColor="#9DA0A7"
                handleTextChange={(e) => setExpenseForm({...expenseForm, description: e})}
              />
            </>
          )}
          {transactionType === "Income" && (
            <TextField
              value={incomeForm.description}
              placeholder='Source of income'
              placeholderTextColor="#9DA0A7"
              handleTextChange={(e) => setIncomeForm({...incomeForm, description: e})}
            />
          )}
        <View className="flex-row mt-5 mr-5">
          {/* Amount */}
        <TextField 
              value={transactionType === 'Expense' ? expenseForm.amount : incomeForm.amount}
              placeholder='Amount'
              placeholderTextColor="#9DA0A7"
              handleTextChange={(e) => {
                const updatedForm = transactionType === 'Expense' ? {...expenseForm, amount: e} : {...incomeForm, amount: e};
                transactionType === 'Expense' ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
              }}
              keyType='decimal-pad'
              containerStyle=" w-[50%]"
            />
          <Text className="absolute top-[14px] left-[113px] text-3xl font-pbold text-[#9da0a7] bg-white">GHS</Text>
          
          {/* Payment method */}
          <View className="w-[50%] -mt-2.5">
            <DropdownComponent 
              paymentMode
              placeholder={isExpenseTab ? "Payment mode" : "Received by"}
              value={transactionType === 'Expense' ? expenseForm.paymentMode : incomeForm.paymentMode}
              setValue={(e) => {
                const updatedForm = transactionType === 'Expense' ? {...expenseForm, paymentMode: e} : {...incomeForm, paymentMode: e};
                transactionType === 'Expense' ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
              }}
              />
            </View>
        </View>

        <View>
            <RBSheet
            height={270}
            openDuration={50}
            closeDuration={100}
            ref={sheet}>

            <View style={styles.sheetContent}>

              <View style={styles.dateHeaderContainer}>
                  <TouchableOpacity
                          onPress={() => sheet.current.close()}
                      style={styles.dateHeaderButton}>
                      <Text style={styles.dateHeaderButtonCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => {
                        const updatedForm = transactionType === 'Expense' ? {...expenseForm, dateOfPurchase: date.toDateString()} : {...incomeForm, dateOfPurchase: date.toDateString()};
                        transactionType === 'Expense' ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
                        sheet.current.close();
                      }}
                      style={[styles.dateHeaderButton]}>
                      <Text style={styles.dateHeaderButtonDone}>Done</Text>
                  </TouchableOpacity>
              </View>
                <DateTimePicker 
                    mode={"date"}
                    display={"spinner"}
                    value={date}
                    onChange={onChange}
            />
            </View>
          </RBSheet>
        </View>

      {/* Type */}
      <View className="flex-row">
          {/* <View className="w-[47%] mt-3 mr-5">
          <DropdownComponent 
            placeholder='Type of transaction'
            category={transactionType === 'Expense' ? expenseForm.type : incomeForm.type}
              setCategory={(e) => {
                const updatedForm = transactionType === 'Expense' ? {...expenseForm, type: e} : {...incomeForm, type: e};
                transactionType === 'Expense' ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
              }}
            transactionsType
            />
          </View> */}

        {/* Category */}
        <View className={`mt-4 w-[50%]`}> 
        {(categoryValue !== 'none' && !hasTyped) || showDropdown ? (
          <DropdownComponent
            Category={transactionType}
            placeholder={isExpenseTab ? "Category" : "Category"}
            value={categoryValue}
            setValue={(e) => {
              const updatedForm = isExpenseTab ? { ...expenseForm, category: e } : { ...incomeForm, category: e };
              isExpenseTab ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
            }}
          />
        ) : (
          
          <View>
              <TextField
              placeholder={isExpenseTab ? "Spent on" : "Source"}
              value={categoryValue}
              onChangeText={isExpenseTab ? handleTextChangeExpense : handleTextChangeIncome}
              otherStyles='mt-3 -mr-2'
            />
            {/* <TouchableOpacity onPress={() => {setShowDownDrop(true)}} className={`items-center justify-center absolute ${pressed ? 'bg-[#f00]' : ''}`}>
              <Text className=" font-mregular text-base ml-[105px] text-[#1F41BB] mt-4">set date</Text>
            </TouchableOpacity> */}
        </View>
      )}

        </View>
         
        {/* Date Picker IOS */}
          <View className={`flex-row w-[95%] my-6 mt-7 px-1`}>
            <TextField
              value={transactionType === 'Expense' ? expenseForm.dateOfPurchase : incomeForm.dateOfPurchase}
              placeholderTextColor="#9DA0A7"
              placeholder={datePlaceholder}
              editable={false}
              handleTextChange={(e) => {
                const updatedForm = transactionType === 'Expense' ? {...expenseForm, dateOfPurchase: e} : {...incomeForm, dateOfPurchase: e};
                transactionType === 'Expense' ? setExpenseForm(updatedForm) : setIncomeForm(updatedForm);
                transactionType === 'Expense' ? setShowDateBtn(false) : setShowDateBtn(true);
              }}              
              containerStyle=" bg-white w-[50%] h-[70px] self-center rounded-[20px]"
              
             />
              { !showDateBtn && (
                <TouchableOpacity onPress={() => { sheet.current.open(); setPressed(false)}} className={`items-center justify-center absolute ${pressed ? 'bg-[#f00]' : ''}`}>
                  <Text className=" font-mregular text-base ml-[105px] text-[#1F41BB] mt-4">set date</Text>
                </TouchableOpacity>
              )}
           </View>
        </View>

        <View style={[ transactionType === 'Expense' && { marginTop: -20 }]}>
          <CustomButton 
            title={transactionType === "Expense" ? "Add Expense" : "Add Income"}
            handlePress={submit}
            disabled={!formReady || isSubmitting}
            containerStyles="w-[90%] self-center items-center mt-[90px]"
            isLoading={isSubmitting}
          />
        </View>

</View>


    </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerSheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  textTitle: {
    fontSize: 20,
    marginTop: 120,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    width: 150,
    backgroundColor: '#4EB151',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 3,
    margin: 10,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetContent: {
    paddingTop: -5,
    //paddingBottom: 10,
    paddingHorizontal: 5,
    alignItems: 'stretch',
  },

  dateHeaderContainer: {
    height: 40,
    //paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateHeaderButton: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeaderButtonCancel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
  },
  dateHeaderButtonDone: {
    fontSize: 18,
    color: '#006BFF',
    fontWeight: '500',
  },


btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#2b64e3',
    borderColor: '#2b64e3',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#2b64e3',
  },
text: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
},
screen: {
    flex: 1,

},
btnText:{
    postion: 'absolute',
    top: 0,
    height: 60,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
},
btnCancel: {
    left: 0
},
btnDone: {
    right: 0,
},
  inputIconSend: {
    color: '#006BFF',
  },
  input: {
    flex: 1,
    height: 36,
    borderRadius: 36,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 10,
  },
  messageContainer: {
    flex: 1,
    padding: 25,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  message: {
    fontSize: 17,
    lineHeight: 24,
    marginVertical: 20,
  },
  messageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#3385ff',
    marginLeft: 10,
  },
  messageButtonText: {
    color: '#3385ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButtonRight: {
    backgroundColor: '#3385ff',
  },
  messageButtonTextRight: {
    color: '#fff',
  },
});

export default AddExpense;
