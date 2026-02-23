export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export abstract class BaseRepository<T> {
    abstract findById(id: string): Promise<T | null>
    abstract findMany(params?: PaginationParams): Promise<PaginatedResult<T>>
    abstract create(data: Partial<T>): Promise<T>
    abstract update(id: string, data: Partial<T>): Promise<T>
    abstract delete(id: string): Promise<void>
}
