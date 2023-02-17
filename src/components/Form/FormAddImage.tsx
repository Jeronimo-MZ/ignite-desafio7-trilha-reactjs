import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { FieldError, RegisterOptions, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type AddImageFormData = {
  image: FileList;
  title: string;
  description: string;
};

const regex = new RegExp(/\.(jpeg|jpg|png|gif)$/i);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations: Record<keyof AddImageFormData, RegisterOptions> = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      validate: {
        lessThan10MB: file =>
          file[0].size < MAX_FILE_SIZE || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: file =>
          regex.test(file[0].name) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: { message: 'Título obrigatório', value: true },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (values: AddImageFormData & { url: string }) =>
      api.post('/api/images', values),
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: AddImageFormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          isClosable: true,
        });
        return;
      }

      await mutation.mutateAsync({ ...data, url: imageUrl });
      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        isClosable: true,
      });
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        isClosable: true,
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image as unknown as FieldError}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title as unknown as FieldError}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description as unknown as FieldError}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
