import { test, expect, type Page, type Locator } from '@playwright/test'

const email = process.env.DEMUTRAN_ADMIN_EMAIL
const password = process.env.DEMUTRAN_ADMIN_PASSWORD
const marker = () => `QA-AUTO-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const today = () => new Date().toISOString().slice(0, 10)

test.skip(!email || !password, 'Defina DEMUTRAN_ADMIN_EMAIL e DEMUTRAN_ADMIN_PASSWORD no ambiente.')

async function login(page: Page) {
  await page.goto('/')
  await page.getByLabel(/E-mail institucional/i).fill(email!)
  await page.getByLabel(/^Senha/i).fill(password!)
  await page.getByRole('button', { name: /^Entrar/i }).click()
  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible({ timeout: 30_000 })
}

async function openModule(page: Page, name: string) {
  await page.locator('.desktop-nav').getByRole('button', { name, exact: true }).click()
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
}

async function field(page: Page, label: string): Promise<Locator> {
  return page.getByRole('dialog').getByLabel(new RegExp(label, 'i'))
}

async function fillFormField(page: Page, item: { label: string; value?: string; select?: boolean }) {
  const control = await field(page, item.label)
  if (item.select) {
    const options = await control.locator('option').count()
    if (options < 2) throw new Error(`Campo obrigatório sem opções disponíveis: ${item.label}`)
    await control.selectOption({ index: 1 })
  } else {
    await control.fill(item.value ?? '')
  }
}

async function runCrudJourney(page: Page, module: string, uniqueField: string, value: string, extra: Array<{label:string;value?:string;select?:boolean}> = []) {
  const testMarker = marker()
  let record: Locator | null = null
  await openModule(page, module)
  await page.getByRole('button', { name: 'Novo cadastro', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  const unique = await field(page, uniqueField)
  await unique.fill(`${value} ${testMarker}`)
  for (const item of extra) await fillFormField(page, item)

  await page.getByRole('dialog').getByRole('button', { name: /Salvar registro/i }).click()
  await expect(page.getByRole('dialog')).toBeHidden({ timeout: 30_000 })
  await expect(page.getByRole('status')).toContainText(/cadastrado no banco de dados/i, { timeout: 15_000 })

  await page.getByRole('button', { name: 'Histórico', exact: true }).click()
  record = page.locator('.record-card').filter({ hasText: testMarker })
  await expect(record).toHaveCount(1, { timeout: 20_000 })

  await record.getByRole('button', { name: 'Editar' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const editedValue = `${value} EDITADO ${testMarker}`
  await (await field(page, uniqueField)).fill(editedValue)
  await page.getByRole('dialog').getByRole('button', { name: /Salvar registro/i }).click()
  await expect(page.getByRole('dialog')).toBeHidden({ timeout: 30_000 })
  await expect(page.getByRole('status')).toContainText(/atualizado no banco de dados/i, { timeout: 15_000 })
  await expect(record).toContainText('EDITADO', { timeout: 15_000 })

  page.once('dialog', dialog => dialog.accept())
  await record.getByRole('button', { name: 'Excluir' }).click()
  await expect(record).toHaveCount(0, { timeout: 20_000 })
}

test.describe('Jornada administrativa DEMUTRAN — CRUD real pela interface', () => {
  test.beforeEach(async ({ page }) => login(page))

  test('Material: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Material', 'Material', 'Material de teste', [
      { label: 'Categoria', select: true }, { label: 'Quantidade atual', value: '17' },
    ])
  })

  test('Ordens de Serviço: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Ordens de Serviço', 'Serviço solicitado', 'OS de teste', [
      { label: 'Categoria', select: true }, { label: 'Local do serviço', value: 'Local QA automatizado' },
      { label: 'Data de abertura', value: today() },
    ])
  })

  test('Escala: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Escala', 'Agente / equipe', 'Equipe QA', [
      { label: 'Data', value: today() }, { label: 'Turno', select: true }, { label: 'Local de atuação', value: 'Local QA' },
    ])
  })

  test('Sinalização Viária: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Sinalização Viária', 'Descrição', 'Sinalização QA', [
      { label: 'Tipo de sinalização', select: true }, { label: 'Local / endereço', value: 'Endereço QA' }, { label: 'Quantidade', value: '2' },
    ])
  })

  test('Educação para o Trânsito: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Educação para o Trânsito', 'Nome da ação / campanha', 'Campanha QA', [
      { label: 'Tipo de atividade', select: true }, { label: 'Local da atividade', value: 'Local QA' },
      { label: 'Data da atividade', value: today() }, { label: 'Responsável / equipe', value: 'Equipe QA' },
    ])
  })

  test('Veículos de Aluguel: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await runCrudJourney(page, 'Veículos de Aluguel', 'Placa', 'QAZ-9A99', [
      { label: 'Modelo', value: 'Veículo de teste QA' }, { label: 'Empresa locadora', value: 'Locadora QA' },
      { label: 'Valor mensal', value: '1000.00' },
    ])
  })

  test('Sinistro: cadastrar, editar, consultar e excluir', async ({ page }) => {
    await openModule(page, 'Sinistro')
    await page.getByRole('button', { name: 'Novo cadastro', exact: true }).click()
    const server = await field(page, 'Matrícula do servidor')
    const hasServer = await server.locator('option').count() >= 2
    await page.getByRole('button', { name: 'Cancelar' }).click()
    if (!hasServer) test.skip(true, 'Não há servidor ativo com matrícula disponível para vincular ao sinistro de teste.')
    await runCrudJourney(page, 'Sinistro', 'Local / endereço', 'Local QA', [
      { label: 'Data e hora da ocorrência', value: new Date().toISOString().slice(0, 16) },
      { label: 'Matrícula do servidor', select: true },
    ])
  })

  test('Pesquisa global e central de relatórios abrem sem erro', async ({ page }) => {
    await page.getByLabel('Buscar em todo o sistema').fill('QA-AUTO-NAO-EXISTE')
    await page.getByRole('button', { name: 'Pesquisar registros' }).click()
    await expect(page.getByRole('heading', { name: 'Resultados da pesquisa global' })).toBeVisible()
    await openModule(page, 'Relatórios')
    await expect(page.getByRole('heading', { name: 'Central de relatórios' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Exportar CSV/i })).toBeVisible()
  })
})
