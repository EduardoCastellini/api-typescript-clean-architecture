export interface UpdateAccessTokenRepository {
  update: (id: string, Token: string) => Promise<void>
}
