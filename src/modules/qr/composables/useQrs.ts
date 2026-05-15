import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { unref } from 'vue'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import type {
  TypeQrCreateQrRequest,
  TypeQrQrCodeResponse,
  TypeQrToggleEnabledRequest,
  TypeQrUpdateTargetUrlRequest,
} from '@/api/__generated__/qr/data-contracts.ts'

const QRS_KEY = ['qrs'] as const
const qrKey = (id: string) => ['qr', id] as const
const statsKey = (id: string) => ['qr-stats', id] as const

export function useQrList() {
  return useQuery({
    queryKey: QRS_KEY,
    queryFn: () => ApiClientQr.listUserQrs(),
  })
}

export function useQr(id: MaybeRef<string>) {
  return useQuery({
    queryKey: ['qr', id] as const,
    queryFn: () => ApiClientQr.getQr(unref(id)),
  })
}

export function useQrStats(id: MaybeRef<string>) {
  return useQuery({
    queryKey: ['qr-stats', id] as const,
    queryFn: () => ApiClientQr.getScanLogs(unref(id)),
  })
}

export function useCreateQr() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TypeQrCreateQrRequest) => ApiClientQr.createQr(data),
    onSuccess: (created) => {
      qc.setQueryData<TypeQrQrCodeResponse[]>(QRS_KEY, (prev) => [created, ...(prev ?? [])])
    },
  })
}

export function useDeleteQr() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ApiClientQr.deleteQr(id),
    onSuccess: (_, id) => {
      qc.setQueryData<TypeQrQrCodeResponse[]>(QRS_KEY, (prev) =>
        (prev ?? []).filter((q) => q.id !== id),
      )
      qc.removeQueries({ queryKey: qrKey(id) })
      qc.removeQueries({ queryKey: statsKey(id) })
    },
  })
}

export function useToggleEnabled() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TypeQrToggleEnabledRequest }) =>
      ApiClientQr.toggleQrEnabled(id, data),
    onSuccess: (res, vars) => {
      qc.setQueryData<TypeQrCodeResponseLike>(qrKey(vars.id), (prev) =>
        prev ? { ...prev, enabled: res.enabled, updated_at: res.updated_at } : prev,
      )
      qc.setQueryData<TypeQrQrCodeResponse[]>(QRS_KEY, (prev) =>
        (prev ?? []).map((q) =>
          q.id === vars.id ? { ...q, enabled: res.enabled, updated_at: res.updated_at } : q,
        ),
      )
    },
  })
}

export function useUpdateTarget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TypeQrUpdateTargetUrlRequest }) =>
      ApiClientQr.updateTargetUrl(id, data),
    onSuccess: (res, vars) => {
      qc.setQueryData<TypeQrCodeResponseLike>(qrKey(vars.id), (prev) =>
        prev ? { ...prev, target_url: res.url } : prev,
      )
      qc.setQueryData<TypeQrQrCodeResponse[]>(QRS_KEY, (prev) =>
        (prev ?? []).map((q) => (q.id === vars.id ? { ...q, target_url: res.url } : q)),
      )
    },
  })
}

type TypeQrCodeResponseLike = TypeQrQrCodeResponse | undefined

export function useQrImage(id: MaybeRef<string>) {
  return useQuery({
    queryKey: ['qr-image', id] as const,
    queryFn: async () => {
      const blob = (await ApiClientQr.getQrImage(unref(id))) as unknown as Blob
      return URL.createObjectURL(blob)
    },
    staleTime: 5 * 60 * 1000,
  })
}
