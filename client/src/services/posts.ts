import api, { ApiSuccessResponse } from './api';
import type { PostRecord } from '../types/domain';

export type PostLikeUserRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

export type PostCommentRecord = {
  id: string;
  post_id: string;
  user_id: string;
  text: string;
  created_at: string | null;
  author: PostLikeUserRecord;
  likes_count: number;
  is_liked: boolean;
};

type UploadPostImageResponse = {
  image_url: string;
};

type CreatePostInput = {
  image_url: string;
  content?: string;
  category?: string | null;
};

function inferImageMimeType(uri: string) {
  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

function inferImageName(uri: string) {
  const rawName = uri.split('?')[0]?.split('/').pop();
  return rawName && rawName.includes('.') ? rawName : `post-${Date.now()}.jpg`;
}

export async function uploadPostImage(uri: string) {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: inferImageName(uri),
    type: inferImageMimeType(uri),
  } as unknown as Blob);

  const response = (await api.post<ApiSuccessResponse<UploadPostImageResponse>>(
    '/posts/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )) as unknown as ApiSuccessResponse<UploadPostImageResponse>;

  return response.data.image_url;
}

export async function createPost(input: CreatePostInput) {
  const response = (await api.post<ApiSuccessResponse<PostRecord>>('/posts', {
    image_url: input.image_url,
    content: input.content?.trim() ?? '',
    category: input.category ?? null,
  })) as unknown as ApiSuccessResponse<PostRecord>;

  return response.data;
}

export async function listOwnPosts() {
  const response =
    (await api.get<ApiSuccessResponse<PostRecord[]>>('/posts/me')) as unknown as ApiSuccessResponse<
      PostRecord[]
    >;

  return response.data;
}

export async function listFeedPosts() {
  const response =
    (await api.get<ApiSuccessResponse<PostRecord[]>>('/posts/feed')) as unknown as ApiSuccessResponse<
      PostRecord[]
    >;

  return response.data;
}

export async function listSavedPosts() {
  const response =
    (await api.get<ApiSuccessResponse<PostRecord[]>>('/posts/me/saved')) as unknown as ApiSuccessResponse<
      PostRecord[]
    >;

  return response.data;
}

export async function likePost(postId: string) {
  const response =
    (await api.post<ApiSuccessResponse<PostRecord>>(`/posts/${postId}/like`)) as unknown as ApiSuccessResponse<
      PostRecord
    >;

  return response.data;
}

export async function unlikePost(postId: string) {
  const response =
    (await api.delete<ApiSuccessResponse<PostRecord>>(`/posts/${postId}/like`)) as unknown as ApiSuccessResponse<
      PostRecord
    >;

  return response.data;
}

export async function savePost(postId: string) {
  const response =
    (await api.post<ApiSuccessResponse<PostRecord>>(`/posts/${postId}/save`)) as unknown as ApiSuccessResponse<
      PostRecord
    >;

  return response.data;
}

export async function unsavePost(postId: string) {
  const response =
    (await api.delete<ApiSuccessResponse<PostRecord>>(
      `/posts/${postId}/save`,
    )) as unknown as ApiSuccessResponse<PostRecord>;

  return response.data;
}

export async function listPostLikes(postId: string) {
  const response =
    (await api.get<ApiSuccessResponse<PostLikeUserRecord[]>>(
      `/posts/${postId}/likes`,
    )) as unknown as ApiSuccessResponse<PostLikeUserRecord[]>;

  return response.data;
}

export async function listPostComments(postId: string) {
  const response =
    (await api.get<ApiSuccessResponse<PostCommentRecord[]>>(
      `/posts/${postId}/comments`,
    )) as unknown as ApiSuccessResponse<PostCommentRecord[]>;

  return response.data;
}

export async function createPostComment(postId: string, text: string) {
  const response =
    (await api.post<ApiSuccessResponse<PostCommentRecord>>(
      `/posts/${postId}/comments`,
      { text },
    )) as unknown as ApiSuccessResponse<PostCommentRecord>;

  return response.data;
}

export async function deletePostComment(commentId: string) {
  await api.delete<ApiSuccessResponse<null>>(`/posts/comments/${commentId}`);
}

export async function deletePost(postId: string) {
  await api.delete<ApiSuccessResponse<null>>(`/posts/${postId}`);
}

export async function likePostComment(commentId: string) {
  const response =
    (await api.post<ApiSuccessResponse<PostCommentRecord>>(
      `/posts/comments/${commentId}/like`,
    )) as unknown as ApiSuccessResponse<PostCommentRecord>;

  return response.data;
}

export async function unlikePostComment(commentId: string) {
  const response =
    (await api.delete<ApiSuccessResponse<PostCommentRecord>>(
      `/posts/comments/${commentId}/like`,
    )) as unknown as ApiSuccessResponse<PostCommentRecord>;

  return response.data;
}
