export interface UpdateAccessTokenRepository {
  updateAccessToken: (id: string, Token: string) => Promise<void>
}
