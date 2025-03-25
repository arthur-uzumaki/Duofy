export class WrongCredentialsError extends Error {
  constructor() {
    super('Credential are not valid.')
  }
}
