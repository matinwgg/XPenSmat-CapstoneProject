import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card } from '../../../../components/Transaction';
import { recoverPwd,  verifyEmail, getAccount } from '../../../../lib/appwrite';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import FeatherIcon from 'react-native-vector-icons/Feather';

const VerificationScreen = () => {
  const [heading, setHeading] = useState("Get Verified")
  const [subHeading, setSubHeading ] = useState("Will you like to verify your email?")
  const [buttonTitle, setButtonTitle] = useState("Contine")
  const [isLoading, setIsLoading] = useState(false);
  const { user, setIsUserVerified } = useGlobalContext()
  const [showStatus, setShowStatus] = useState(false);
  const [isVerified, setIsVerified ] = useState(false)

  const CheckCircle = () => {
    return (
      <FeatherIcon
          name="check-circle"
          size={24}
          color="#2ecc71"
        />
    )
  }

  const AlertMe = () => {
    return (
      <FeatherIcon
          name="alert-triangle"
          size={24}
          //color="#2ecc71"
        />
    )
  }

  const checkVerification = async () => {
    try {
        const account = await getAccount(); // Fetch the account details
        const isVerified = account.emailVerification; // Check if the email is verified

        if (isVerified) {
            console.log("Email is verified");
            return true;
        } else {
            console.log("Email is not verified");
            return false;
        }
    } catch (error) {
        console.error("An error occurred while checking verification:", error);
        return false; // Assume not verified if there's an error
    }
};

  useEffect(() => {
    const verifyUser = async () => {
        const verified = await checkVerification();
        setIsVerified(verified);
        setIsUserVerified(verified)
    };
  
    verifyUser(); // Call the verification check when the component mounts
  }, []);


  const handleContinue = async () => {
    setIsLoading(true)
    if (recoverPwd.isUserVerified()) {
      setHeading("Verified")
      setSubHeading("You are already verified!")
      setButtonTitle("OK")
      setIsLoading(false)
      CheckCircle()
      return
    }
    try {
      const value = await verifyEmail(user.email); 
      if (value) {
        setHeading("Verification email sent!");
        setSubHeading("We've sent you a verification link to your email. Tap on it to get verified.");
        setButtonTitle("OK");
      } else {
        setHeading("Oops!");
        setSubHeading("An error occurred.");
        setButtonTitle("Try later");
      }
    } catch (error) {
      setHeading("Oops!");
      setSubHeading("An error occurred.");
      setButtonTitle("Try later");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    
    <View style={{   flex: 1, justifyContent: 'center', alignItems: 'center',  marginTop: -50}}>
        <Card style={{ height: 200, width: 300}}>
          <View className="items-center">
            {recoverPwd.isUserVerified() && ( CheckCircle() )}
          </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10, textAlign: 'center' }}>{heading}</Text>
      <Text style={{ fontSize: 17, marginBottom: 50, textAlign: 'center'  }}>{subHeading}</Text>
      <View className=" bg-[#007AFF]  justify-center rounded-lg">
        <TouchableOpacity
            onPress={handleContinue}
            style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 20 }}
            disabled={isLoading}
        >
        {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center',  }}>{buttonTitle}</Text>
        )}
    </TouchableOpacity>
      </View>
      </Card>
    </View>
  );
};

export default VerificationScreen;
