const {
  convertToCHF,
  findApprovalRule
} = require('../AGENT/Services/approvalService');

describe('Approval Service', () => {

  test('should convert EUR to CHF', () => {
    const fxRates = {
      EUR: 0.95
    };

    const result = convertToCHF(
      1000,
      'EUR',
      fxRates
    );

    expect(result).toBe(950);
  });

  test('should throw error for unknown currency', () => {
    expect(() =>
      convertToCHF(
        1000,
        'XYZ',
        {}
      )
    ).toThrow('Unknown currency');
  });

  test('should find correct approval rule', () => {
    const approvalLimits = [
      {
        from: 0,
        to: 10000,
        required_roles: ['manager']
      },
      {
        from: 10001,
        to: null,
        required_roles: ['director']
      }
    ];

    const rule = findApprovalRule(
      5000,
      approvalLimits
    );

    expect(rule.required_roles)
      .toContain('manager');
  });

});