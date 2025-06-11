import { visitRoute } from '../../helpers/visitRoute.ts'

test('Visit LoginPage', async () => {
  const { view } = await visitRoute('/login')
  view.debug()
})
