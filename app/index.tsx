import { Text, View, Pressable, TextInput, FlatList, Image } from 'react-native';
import { useEffect, useState } from 'react';
import {
  LucideHome,
  LucideTrash2,
  LucideImagePlus,
  LucideLayoutGrid,
  LucideList,
  LucidePencil,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProductsStore, MAX_PRODUCTS, Product } from '@/store/products';
import Toast from 'react-native-toast-message';
import { ensureNotificationPermission, notifyProductLimitReached } from '@/lib/notifications';
import { EditProductModal } from '@/components/EditProductModal';

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
  const [isGridView, setIsGridView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const renderItem = ({ item }: { item: Product }) => {
    if (isGridView) {
      return (
        <View className="flex-1 m-2 bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-100">
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} className="w-full h-32 rounded-md mb-3 bg-gray-200" />
          ) : (
            <View className="w-full h-32 rounded-md mb-3 bg-gray-200 items-center justify-center">
              <LucideHome color="#9CA3AF" size={32} />
            </View>
          )}
          <Text className="text-gray-900 font-medium text-lg mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-gray-600 font-semibold mb-3">₦{item.price.toFixed(2)}</Text>
          <View className="flex-row justify-end gap-2">
            <Pressable
              className="p-2 rounded-md bg-blue-100"
              onPress={() => setEditingProduct(item)}
              accessibilityRole="button"
            >
              <LucidePencil color="#2563EB" size={16} />
            </Pressable>
            <Pressable
              className="p-2 rounded-md bg-red-100"
              onPress={() => removeProduct(item.id)}
              accessibilityRole="button"
            >
              <LucideTrash2 color="#DC2626" size={16} />
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3 border border-gray-100 shadow-sm">
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} className="w-16 h-16 rounded-md mr-4 bg-gray-200" />
        ) : (
          <View className="w-16 h-16 rounded-md mr-4 bg-gray-200 items-center justify-center">
            <LucideHome color="#9CA3AF" size={24} />
          </View>
        )}
        <View className="flex-1">
          <Text className="text-gray-900 font-medium text-lg">{item.name}</Text>
          <Text className="text-gray-600">₦{item.price.toFixed(2)}</Text>
        </View>
        <View className="flex-row gap-3">
          <Pressable
            className="p-2 rounded-md bg-blue-100"
            onPress={() => setEditingProduct(item)}
            accessibilityRole="button"
          >
            <LucidePencil color="#2563EB" size={20} />
          </Pressable>
          <Pressable
            className="p-2 rounded-md bg-red-100"
            onPress={() => removeProduct(item.id)}
            accessibilityRole="button"
          >
            <LucideTrash2 color="#DC2626" size={20} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        data={products}
        key={isGridView ? 'grid' : 'list'}
        numColumns={isGridView ? 2 : 1}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-2xl font-bold text-gray-900">Your Products</Text>
                <Text className="text-gray-600 text-sm mt-1">
                  {remaining > 0 ? `${remaining} of ${MAX_PRODUCTS} slots remaining` : 'Limit reached'}
                </Text>
              </View>
              <Pressable
                className="p-2 bg-gray-100 rounded-lg"
                onPress={() => setIsGridView(!isGridView)}
              >
                {isGridView ? (
                  <LucideList color="#374151" size={24} />
                ) : (
                  <LucideLayoutGrid color="#374151" size={24} />
                )}
              </Pressable>
            </View>

            <View className="my-6 p-5 border border-gray-200 rounded-2xl bg-gray-50/50">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Add New Product</Text>
              <View className="mb-3">
                <TextInput
                  placeholder="Product Name"
                  onChangeText={(t) => setValue('name', t)}
                  className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base"
                />
                {errors.name?.message ? (
                  <Text className="text-red-600 mt-1 text-sm">{errors.name.message}</Text>
                ) : null}
              </View>
              <View className="mb-3">
                <TextInput
                  placeholder="Price (e.g. 5000)"
                  keyboardType="decimal-pad"
                  onChangeText={(t) => setValue('price', t)}
                  className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base"
                />
                {errors.price?.message ? (
                  <Text className="text-red-600 mt-1 text-sm">{errors.price.message}</Text>
                ) : null}
              </View>
              <View className="mb-5 flex-row items-center">
                <Pressable
                  className="flex-row items-center px-4 py-3 bg-white border border-gray-300 rounded-lg"
                  onPress={pickImage}
                >
                  <LucideImagePlus color="#4B5563" size={20} />
                  <Text className="text-gray-700 ml-2 font-medium">Pick Photo</Text>
                </Pressable>
                {imageUri && (
                  <View className="ml-4 flex-row items-center">
                    <Image source={{ uri: imageUri }} className="w-10 h-10 rounded-md bg-gray-200" />
                    <Text className="ml-2 text-green-600 text-sm font-medium">Selected</Text>
                  </View>
                )}
              </View>
              <Pressable
                className={`rounded-xl px-4 py-4 items-center ${
                  products.length >= MAX_PRODUCTS ? 'bg-gray-400' : 'bg-blue-600 shadow-md shadow-blue-200'
                }`}
                disabled={products.length >= MAX_PRODUCTS}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-white font-bold text-lg">
                  {products.length >= MAX_PRODUCTS ? 'Limit Reached' : 'Add Product'}
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-gray-400 text-center text-lg">No products yet.</Text>
            <Text className="text-gray-400 text-center text-sm">Add your first product above.</Text>
          </View>
        }
      />

      <EditProductModal
        isVisible={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
      />
    </View>
  );
}
