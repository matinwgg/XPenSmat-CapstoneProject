import { useState } from 'react';
import { router, usePathname } from 'expo-router';
import { View, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Search entry point used on the transaction history screen.
 *
 * The search action is icon-only with a 44pt touch target, and the field can
 * be cleared without leaving the screen. Submitting an empty query is simply a
 * no-op instead of interrupting the user with an alert.
 */
const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  const [isFocused, setIsFocused] = useState(false);

  const submit = () => {
    const term = query.trim();
    if (!term) return;

    if (pathname.startsWith('/search')) {
      router.setParams({ query: term });
    } else {
      router.push(`/search/${encodeURIComponent(term)}`);
    }
  };

  return (
    <View
      style={{
        borderColor: isFocused ? '#1F41BB' : '#E2E8F0',
      }}
      className="flex-row items-center w-full h-[52px] px-4 bg-white rounded-[14px] border"
    >
      <Ionicons name="search" size={20} color="#64748B" />
      <TextInput
        className="flex-1 text-base text-[#0F172A] font-pregular ml-2.5"
        value={query}
        placeholder="Search transactions"
        placeholderTextColor="#94A3B8"
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={submit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search transactions"
      />

      {query.length > 0 ? (
        <TouchableOpacity
          onPress={() => setQuery('')}
          hitSlop={8}
          className="w-9 h-9 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color="#94A3B8" />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={submit}
        className="w-10 h-10 rounded-xl bg-[#EEF2FF] items-center justify-center ml-1"
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Ionicons name="arrow-forward" size={18} color="#1F41BB" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
