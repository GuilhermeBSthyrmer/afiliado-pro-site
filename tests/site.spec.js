import { test, expect } from '@playwright/test';

/** Junta erros de console e exceções da página para checar no fim de cada teste. */
function vigiarErros(page) {
  const erros = [];
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', (e) => erros.push(e.message));
  return erros;
}

test.describe('Afiliado Pro', () => {
  test('abre sem erros e sem rolagem lateral', async ({ page }) => {
    const erros = vigiarErros(page);
    await page.goto('/');
    await expect(page).toHaveTitle('Afiliado Pro');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A oferta aparece num grupo');
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(sobra).toBeLessThanOrEqual(0);
    expect(erros).toEqual([]);
  });

  test('demo do encarte troca de oferta e pode ser pausada', async ({ page }) => {
    await page.goto('/');
    const loja = page.locator('[data-campo="loja"]');
    await expect(loja).toHaveText('Shopee');
    await page.getByRole('button', { name: 'Próxima oferta' }).click();
    await expect(loja).toHaveText('Mercado Livre');
    await expect(page.locator('[data-campo="desconto"]')).toHaveText('33% OFF');

    const pausar = page.getByRole('button', { name: 'Pausar' });
    await pausar.click();
    await expect(page.locator('[data-acao="pausar"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-acao="pausar"]')).toHaveText('Continuar');
  });

  test('editor de anúncio aplica a formatação do WhatsApp e some com linhas vazias', async ({ page }) => {
    await page.goto('/');
    const previa = page.locator('[data-prev="texto"]');
    // Produto com desconto real: preço riscado e porcentagem arredondada para baixo.
    await expect(previa.locator('s')).toHaveText('R$ 159,00');
    await expect(previa).toContainText('43% OFF');

    // Produto sem preço original: nada de desconto inventado, e o cupom aparece.
    await page.getByRole('radio', { name: /Garrafa/ }).click();
    await expect(previa).not.toContainText('OFF');
    await expect(previa.locator('s')).toHaveCount(0);
    await expect(previa).toContainText('Cupom: GARRAFA10');

    // Modelo escrito à mão.
    await page.locator('#template').fill('*{title}* por _{store}_');
    await expect(previa.locator('strong').first()).toHaveText('Garrafa térmica inox 1 L');
    await expect(previa.locator('em')).toHaveText('Amazon');
    // O modelo não diz onde vai o cupom, então ele entra sozinho no fim, como no app.
    await expect(previa.locator('strong').last()).toHaveText('GARRAFA10');
  });

  test('formulário valida e confirma sem enviar nada', async ({ page }) => {
    await page.goto('/#testar');
    const form = page.locator('[data-form]');
    await form.getByRole('button', { name: 'Quero testar' }).click();
    await expect(page.locator('#e-nome')).toContainText('Escreva seu nome');
    await expect(page.locator('#f-nome')).toHaveAttribute('aria-invalid', 'true');

    await page.locator('#f-nome').fill('Ana Souza');
    await page.locator('#f-contato').fill('isso não é contato');
    await form.getByRole('button', { name: 'Quero testar' }).click();
    await expect(page.locator('#e-contato')).toContainText('não parece');

    await page.locator('#f-contato').fill('(11) 98888-7777');
    await form.getByRole('button', { name: 'Quero testar' }).click();
    await expect(page.locator('.form__ok')).toBeVisible();
    await expect(page.locator('.form__ok')).toContainText('Recebido, Ana');
  });
});
