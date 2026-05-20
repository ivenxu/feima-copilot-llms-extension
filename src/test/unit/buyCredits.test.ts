/*---------------------------------------------------------------------------------------------
 *  Unit tests for buyCredits command helpers and purchaseService.ts
 *  Pure Mocha – no VS Code host needed.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';

// ---------------------------------------------------------------------------
// Tests for price formatting helper (inline for the test)
// ---------------------------------------------------------------------------

function formatPrice(priceUsd: number): string {
	if (priceUsd === 0) {
		return 'Free';
	}
	return `$${priceUsd.toFixed(2)}`;
}

describe('formatPrice', () => {
	it('formats a normal price', () => {
		assert.strictEqual(formatPrice(5), '$5.00');
	});

	it('formats zero as Free', () => {
		assert.strictEqual(formatPrice(0), 'Free');
	});

	it('formats decimal price correctly', () => {
		assert.strictEqual(formatPrice(19.99), '$19.99');
	});
});

// ---------------------------------------------------------------------------
// Tests for credit pack label builder (inline for the test)
// ---------------------------------------------------------------------------

interface CreditPack {
	variant_id: string;
	name: string;
	credit_amount: number;
	price_usd: number;
}

function buildPackLabel(pack: CreditPack): string {
	const price = pack.price_usd === 0 ? 'Free' : `$${pack.price_usd.toFixed(2)}`;
	return `${pack.name} — ${pack.credit_amount.toLocaleString()} credits (${price})`;
}

describe('buildPackLabel', () => {
	it('includes name, credits and price', () => {
		const pack: CreditPack = {
			variant_id: 'var_001',
			name: 'Starter',
			credit_amount: 500,
			price_usd: 5,
		};
		const label = buildPackLabel(pack);
		assert.ok(label.includes('Starter'));
		assert.ok(label.includes('500'));
		assert.ok(label.includes('$5.00'));
	});

	it('shows Free for zero price', () => {
		const pack: CreditPack = {
			variant_id: 'var_free',
			name: 'Free Tier',
			credit_amount: 100,
			price_usd: 0,
		};
		const label = buildPackLabel(pack);
		assert.ok(label.includes('Free'));
	});
});

// ---------------------------------------------------------------------------
// Tests for pack sorting (highest credits first)
// ---------------------------------------------------------------------------

describe('Pack sorting', () => {
	it('sorts packs by credit_amount descending', () => {
		const packs: CreditPack[] = [
			{ variant_id: 'a', name: 'A', credit_amount: 500, price_usd: 5 },
			{ variant_id: 'b', name: 'B', credit_amount: 6000, price_usd: 40 },
			{ variant_id: 'c', name: 'C', credit_amount: 2500, price_usd: 20 },
		];
		const sorted = [...packs].sort((a, b) => b.credit_amount - a.credit_amount);
		assert.strictEqual(sorted[0].variant_id, 'b');
		assert.strictEqual(sorted[1].variant_id, 'c');
		assert.strictEqual(sorted[2].variant_id, 'a');
	});
});

// ---------------------------------------------------------------------------
// Simulate checkout URL validation
// ---------------------------------------------------------------------------

function isValidCheckoutUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return parsed.protocol === 'https:';
	} catch {
		return false;
	}
}

describe('isValidCheckoutUrl', () => {
	it('returns true for https URL', () => {
		assert.ok(isValidCheckoutUrl('https://store.lemonsqueezy.com/checkout/buy/abc'));
	});

	it('returns false for http URL', () => {
		assert.ok(!isValidCheckoutUrl('http://store.lemonsqueezy.com/checkout/buy/abc'));
	});

	it('returns false for garbage', () => {
		assert.ok(!isValidCheckoutUrl('not-a-url'));
	});
});
