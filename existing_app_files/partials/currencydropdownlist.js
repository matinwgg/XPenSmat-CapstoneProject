import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export function CurrencyDropdown({
  containerStyle,
  items,
  value,
  setValue,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropDownPicker
      open={isOpen}
      setOpen={setIsOpen}
      value={value}
      setValue={setValue}
      items={items}
      containerStyle={containerStyle}
      style={styles.box}
      min={0}
      placeholder="Select a currency"
      searchable
      mode="BADGE"
      listMode="MODAL"
      labelProps={{
        numberOfLines: 1,
      }}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#99AAAB",
  },
});