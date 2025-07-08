import { visitRoute } from '../../helpers/visitRoute.ts'

test('Visit LoginPage', async () => {
  await visitRoute('/login')
})
