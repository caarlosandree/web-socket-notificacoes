import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

// Tipos baseados no padrão de resposta do backend
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Cria instância do axios com configurações base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v${process.env.NEXT_PUBLIC_API_VERSION || '1'}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request - adiciona token se disponível
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    console.log('[axios] request:', config.method?.toUpperCase(), config.url)
    console.log('[axios] token existe:', !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[axios] token adicionado ao header')
    }
    return config
  },
  (error) => {
    console.error('[axios] request error:', error)
    return Promise.reject(error)
  }
)

// Interceptor de response - tratamento padronizado de erros
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Tratamento de erros HTTP
    if (error.response) {
      const errorData = error.response.data

      // 401 - Não autenticado
      if (error.response.status === 401) {
        // Tentar refresh token ou redirecionar para login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }

      // Retornar erro formatado
      return Promise.reject(errorData || { success: false, error: 'Erro desconhecido' })
    }

    // Erros de rede
    if (error.request) {
      return Promise.reject({ success: false, error: 'Erro de conexão com o servidor' })
    }

    // Erros de configuração
    return Promise.reject({ success: false, error: error.message || 'Erro ao processar requisição' })
  }
)

// Helper para verificar se é resposta de sucesso
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.success === true
}

// Wrapper para requisições GET
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await axiosInstance.get<ApiResponse<T>>(url, { params })
  if (isSuccessResponse(response.data)) {
    return response.data.data
  }
  throw new Error(response.data.error)
}

// Wrapper para requisições POST
export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await axiosInstance.post<ApiResponse<T>>(url, data)
  if (isSuccessResponse(response.data)) {
    return response.data.data
  }
  throw new Error(response.data.error)
}

// Wrapper para requisições PUT
export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await axiosInstance.put<ApiResponse<T>>(url, data)
  if (isSuccessResponse(response.data)) {
    return response.data.data
  }
  throw new Error(response.data.error)
}

// Wrapper para requisições PATCH
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await axiosInstance.patch<ApiResponse<T>>(url, data)
  if (isSuccessResponse(response.data)) {
    return response.data.data
  }
  throw new Error(response.data.error)
}

// Wrapper para requisições DELETE
export async function del<T>(url: string): Promise<T> {
  const response = await axiosInstance.delete<ApiResponse<T>>(url)
  if (isSuccessResponse(response.data)) {
    return response.data.data
  }
  throw new Error(response.data.error)
}

export default axiosInstance
