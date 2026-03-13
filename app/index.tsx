import { Text, View, Pressable, TextInput, FlatList, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { LucideHome, LucideTrash2, LucideImagePlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductsStore, MAX_PRODUCTS, Product } from '@/store/products';
import Toast from 'react-native-toast-message';
import { ensureNotificationPermission, notifyProductLimitReached } from '@/lib/notifications';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
});

type FormValues = z.infer<typeof schema>;

export default function ProductsScreen() {
  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const removeProduct = useProductsStore((s) => s.removeProduct);
  const remaining = MAX_PRODUCTS - products.length;
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', price: '' } });

  useEffect(() => {
    register('name');
    register('price');
  }, [register]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Toast.show({ type: 'error', text1: 'Permission required', text2: 'Allow photo library access' });
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setImageUri(res.assets[0].uri);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const before = products.length;
    const priceNum = Number(values.price);
    const result = addProduct({ name: values.name, price: priceNum, imageUri });
    if (!result.ok && result.reason === 'limit') {
      Toast.show({ type: 'error', text1: 'Limit reached', text2: 'You can upload up to 5 products.' });
      await ensureNotificationPermission();
      await notifyProductLimitReached();
      return;
    }
    if (before < MAX_PRODUCTS && before + 1 === MAX_PRODUCTS) {
      const granted = await ensureNotificationPermission();
      if (granted) {
        await notifyProductLimitReached();
      }
    }
    Toast.show({ type: 'success', text1: 'Product added' });
    setImageUri(null);
    reset();
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3">
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} className="w-12 h-12 rounded-md mr-3" />
      ) : (
        <View className="w-12 h-12 rounded-md mr-3 bg-gray-200 items-center justify-center">
          <LucideHome color="#4B5563" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-gray-900 font-medium">{item.name}</Text>
        <Text className="text-gray-600">₦{item.price.toFixed(2)}</Text>
      </View>
      <Pressable
        className="px-3 py-2 rounded-md bg-red-600"
        onPress={() => removeProduct(item.id)}
        accessibilityRole="button"
      >
        <LucideTrash2 color="#fff" size={16} />
      </Pressable>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-bold text-gray-900">Your Products</Text>
      <Text className="text-gray-600 mt-1">
        {remaining > 0 ? `${remaining} of ${MAX_PRODUCTS} slots remaining` : 'Limit reached'}
      </Text>

      <View className="mt-6 p-4 border border-gray-200 rounded-xl">
        <Text className="text-lg font-semibold text-gray-900 mb-3">Add Product</Text>
        <View className="mb-3">
          <TextInput
            placeholder="Name"
            onChangeText={(t) => setValue('name', t)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.name?.message ? (
            <Text className="text-red-600 mt-1">{errors.name.message}</Text>
          ) : null}
        </View>
        <View className="mb-3">
          <TextInput
            placeholder="Price"
            keyboardType="decimal-pad"
            onChangeText={(t) => setValue('price', t)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.price?.message ? (
            <Text className="text-red-600 mt-1">{errors.price.message}</Text>
          ) : null}
        </View>
        <View className="mb-4 flex-row items-center">
          <Pressable
            className="flex-row items-center px-3 py-2 bg-blue-600 rounded-md"
            onPress={pickImage}
          >
            <LucideImagePlus color="#fff" size={18} />
            <Text className="text-white ml-2">Pick Photo</Text>
          </Pressable>
          <Text className="ml-3 text-gray-700">{imageUri ? 'Photo selected' : 'No photo'}</Text>
        </View>
        <Pressable
          className={`rounded-lg px-4 py-2 ${products.length >= MAX_PRODUCTS ? 'bg-gray-300' : 'bg-green-600'}`}
          disabled={products.length >= MAX_PRODUCTS}
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-medium">
            {products.length >= MAX_PRODUCTS ? 'Limit reached' : 'Add Product'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        className="mt-6"
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-gray-500 mt-4">No products yet. Add your first product above.</Text>
        }
      />
    </View>
  );
}
