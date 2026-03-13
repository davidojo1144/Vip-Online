import { Modal, View, Text, TextInput, Pressable, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product, useProductsStore } from '@/store/products';
import { LucideImagePlus, LucideX } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
});

type FormValues = z.infer<typeof schema>;

type EditProductModalProps = {
  isVisible: boolean;
  onClose: () => void;
  product: Product | null;
};

export function EditProductModal({ isVisible, onClose, product }: EditProductModalProps) {
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    register('name');
    register('price');
  }, [register]);

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('price', product.price.toString());
      setImageUri(product.imageUri || null);
    }
  }, [product, setValue]);

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

  const onSubmit = (values: FormValues) => {
    if (!product) return;
    const priceNum = Number(values.price);
    updateProduct(product.id, {
      name: values.name,
      price: priceNum,
      imageUri,
    });
    Toast.show({ type: 'success', text1: 'Product updated' });
    onClose();
  };

  if (!product) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center px-4">
        <View className="bg-white rounded-xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Edit Product</Text>
            <Pressable onPress={onClose} className="p-2">
              <LucideX color="#6B7280" size={24} />
            </Pressable>
          </View>

          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <TextInput
              defaultValue={product.name}
              onChangeText={(t) => setValue('name', t)}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
            {errors.name?.message ? <Text className="text-red-600 mt-1">{errors.name.message}</Text> : null}
          </View>

          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1">Price</Text>
            <TextInput
              defaultValue={product.price.toString()}
              keyboardType="decimal-pad"
              onChangeText={(t) => setValue('price', t)}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            />
            {errors.price?.message ? <Text className="text-red-600 mt-1">{errors.price.message}</Text> : null}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Photo</Text>
            <View className="flex-row items-center">
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-16 h-16 rounded-md mr-4 bg-gray-100" />
              ) : (
                <View className="w-16 h-16 rounded-md mr-4 bg-gray-100 items-center justify-center border border-gray-200">
                  <LucideImagePlus color="#9CA3AF" size={24} />
                </View>
              )}
              <Pressable
                className="px-4 py-2 bg-gray-100 rounded-md border border-gray-200"
                onPress={pickImage}
              >
                <Text className="text-gray-700 font-medium">Change Photo</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Pressable className="flex-1 py-3 bg-gray-100 rounded-lg items-center" onPress={onClose}>
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </Pressable>
            <Pressable
              className="flex-1 py-3 bg-blue-600 rounded-lg items-center"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white font-medium">Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
