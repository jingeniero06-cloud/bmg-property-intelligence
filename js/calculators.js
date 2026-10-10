// BMG Landlord Compliance & Eviction Timeline Calculators
// Maryland Statutory Engine (Real Property § 8-401, HB 693, § 8-203)
// Version 1.0.0

document.addEventListener('DOMContentLoaded', () => {
  initEvictionCalculator();
  initDepositCalculator();
  initRoiCalculator();
});

// Helper: Format Date
function formatDate(d) {
  if (!d || isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Add Days to date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/* ==========================================================================
   CALCULATOR 1: MARYLAND EVICTION NOTICE & TIMELINE CALCULATOR
   ========================================================================== */
function initEvictionCalculator() {
  const noticeDateInput = document.getElementById('calcNoticeDate');
  const rentDueDateInput = document.getElementById('calcRentDueDate');
  const jurisdictionSelect = document.getElementById('calcJurisdiction');
  const serviceMethodSelect = document.getElementById('calcServiceMethod');
  const calcBtn = document.getElementById('runEvictionCalc');

  // Set default notice date to today
  if (noticeDateInput && !noticeDateInput.value) {
    const today = new Date();
    noticeDateInput.value = today.toISOString().split('T')[0];
  }
  if (rentDueDateInput && !rentDueDateInput.value) {
    const firstOfCurrentMonth = new Date();
    firstOfCurrentMonth.setDate(1);
    rentDueDateInput.value = firstOfCurrentMonth.toISOString().split('T')[0];
  }

  const runCalculation = () => {
    if (!noticeDateInput || !noticeDateInput.value) return;

    const noticeDate = new Date(noticeDateInput.value + 'T00:00:00');
    const jurisdiction = jurisdictionSelect?.value || 'baltimore_city';
    const isMailed = serviceMethodSelect?.value === 'certified_mail';

    // Real Property § 8-401 requires 10 full calendar days before filing.
    // If sent by certified mail, industry standard and judicial best practice adds 3 postal transit days.
    const noticeDays = isMailed ? 13 : 10;
    const noticeExpiryDate = addDays(noticeDate, noticeDays);

    // District Court Filing Date is day after notice expires
    let courtFilingDate = addDays(noticeExpiryDate, 1);
    // If weekend, roll to Monday
    if (courtFilingDate.getDay() === 0) courtFilingDate = addDays(courtFilingDate, 1);
    if (courtFilingDate.getDay() === 6) courtFilingDate = addDays(courtFilingDate, 2);

    // Projected trial date: MD courts typically set failure-to-pay-rent trials within 5-10 business days
    const trialDate = addDays(courtFilingDate, jurisdiction === 'baltimore_city' ? 14 : 9);

    // Tenant Right of Redemption: Can pay and stay up to the moment sheriff arrives, unless landlord has 3 prior judgments in prior 12 months (4 in Baltimore City)
    const rightOfRedemptionRule = jurisdiction === 'baltimore_city' 
      ? 'Tenant retains right to Pay-and-Stay unless landlord has obtained 4 prior judgments of restitution within the past 12 months.'
      : 'Tenant retains right to Pay-and-Stay unless landlord has obtained 3 prior judgments of restitution within the past 12 months.';

    // Warrant of Restitution deadline: 60 days from judgment
    const warrantDeadline = addDays(trialDate, 60);

    // Render results
    const elNoticeExpiry = document.getElementById('resNoticeExpiry');
    const elFilingDate = document.getElementById('resFilingDate');
    const elTrialDate = document.getElementById('resTrialDate');
    const elWarrantDeadline = document.getElementById('resWarrantDeadline');
    const elJurisdictionNotice = document.getElementById('resJurisdictionNotice');
    const elRedemptionText = document.getElementById('resRedemptionText');

    if (elNoticeExpiry) elNoticeExpiry.textContent = formatDate(noticeExpiryDate);
    if (elFilingDate) elFilingDate.textContent = formatDate(courtFilingDate);
    if (elTrialDate) elTrialDate.textContent = formatDate(trialDate);
    if (elWarrantDeadline) elWarrantDeadline.textContent = formatDate(warrantDeadline);
    if (elRedemptionText) elRedemptionText.textContent = rightOfRedemptionRule;

    // Jurisdiction specific alerts
    if (elJurisdictionNotice) {
      if (jurisdiction === 'baltimore_city') {
        elJurisdictionNotice.innerHTML = `
          <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:12px; color:#92400e; font-size:0.875rem;">
            <strong>⚠️ Baltimore City Mandatory Requirement:</strong> You must present your valid <strong>Baltimore City DHCD Rental License</strong> and current <strong>MDE Lead Inspection Certificate</strong> in court, or your case will be dismissed with prejudice.
          </div>
        `;
      } else if (jurisdiction === 'montgomery') {
        elJurisdictionNotice.innerHTML = `
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:12px; color:#1e40af; font-size:0.875rem;">
            <strong>ℹ️ Montgomery County Note:</strong> Must provide Montgomery County DHCA rental license number and adhere to local rent increase notification guidelines.
          </div>
        `;
      } else if (jurisdiction === 'prince_georges') {
        elJurisdictionNotice.innerHTML = `
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:12px; color:#1e40af; font-size:0.875rem;">
            <strong>ℹ️ Prince George's County Note:</strong> Strict multi-family and single-family licensing compliance required prior to District Court Form DC-CV-082 entry.
          </div>
        `;
      } else {
        elJurisdictionNotice.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:12px; color:#065f46; font-size:0.875rem;">
            <strong>✓ Standard Maryland County:</strong> Adheres to Maryland Statewide Real Property § 8-401 uniform statutory timeline.
          </div>
        `;
      }
    }

    const resultsBox = document.getElementById('evictionCalcResults');
    if (resultsBox) resultsBox.style.display = 'block';
  };

  noticeDateInput?.addEventListener('change', runCalculation);
  rentDueDateInput?.addEventListener('change', runCalculation);
  jurisdictionSelect?.addEventListener('change', runCalculation);
  serviceMethodSelect?.addEventListener('change', runCalculation);
  calcBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    runCalculation();
    showToast('Eviction timeline calculated!');
  });

  // Run on load
  runCalculation();
}

/* ==========================================================================
   CALCULATOR 2: SECURITY DEPOSIT CAP & ESCROW INTEREST VALIDATOR
   ========================================================================== */
function initDepositCalculator() {
  const rentInput = document.getElementById('calcMonthlyRent');
  const depositInput = document.getElementById('calcDepositCollected');
  const startDateInput = document.getElementById('calcLeaseStart');
  const endDateInput = document.getElementById('calcLeaseEnd');
  const interestRateInput = document.getElementById('calcEscrowRate');
  const calcBtn = document.getElementById('runDepositCalc');

  // Default dates: 1-year lease
  if (startDateInput && !startDateInput.value) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    startDateInput.value = oneYearAgo.toISOString().split('T')[0];
  }
  if (endDateInput && !endDateInput.value) {
    const today = new Date();
    endDateInput.value = today.toISOString().split('T')[0];
  }

  const runCalculation = () => {
    const rent = parseFloat(rentInput?.value || 0);
    const deposit = parseFloat(depositInput?.value || 0);
    const startDate = new Date(startDateInput?.value + 'T00:00:00');
    const endDate = new Date(endDateInput?.value + 'T00:00:00');
    const rate = parseFloat(interestRateInput?.value || 1.5) / 100;

    // Statutory Cap under 2024 HB 693 = 1 Month's Rent!
    const maxAllowedDeposit = rent;
    const isIllegal = deposit > maxAllowedDeposit;
    const excessAmount = Math.max(0, deposit - maxAllowedDeposit);
    const potentialPenalty = excessAmount * 3; // Up to 3x penalty under MD Real Property § 8-203

    // Duration in months
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const durationMonths = Math.floor(diffDays / 30.4375);

    // Maryland simple interest calculation:
    // Interest is only required if held > 6 months and deposit is at least $50.
    let accruedInterest = 0;
    if (durationMonths >= 6 && deposit >= 50) {
      // Annual simple interest prorated
      const years = diffDays / 365.25;
      accruedInterest = deposit * rate * years;
    }

    // 45-day return deadline from lease end date
    const returnDeadline = addDays(endDate, 45);
    const today = new Date();
    const daysRemaining = Math.ceil((returnDeadline - today) / (1000 * 60 * 60 * 24));

    // Render results
    const elMaxCap = document.getElementById('resMaxCap');
    const elCapStatus = document.getElementById('resCapStatus');
    const elPenaltyBox = document.getElementById('resPenaltyBox');
    const elAccruedInterest = document.getElementById('resAccruedInterest');
    const elTotalDue = document.getElementById('resTotalDue');
    const elReturnDeadline = document.getElementById('resReturnDeadline');
    const elDaysRemaining = document.getElementById('resDaysRemaining');

    if (elMaxCap) elMaxCap.textContent = `$${maxAllowedDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    if (elCapStatus) {
      if (isIllegal) {
        elCapStatus.innerHTML = `
          <div style="background:#fee2e2; border:1px solid #fecaca; border-radius:6px; padding:12px; color:#991b1b; font-size:0.875rem;">
            <strong>🚨 STATUTORY VIOLATION (HB 693):</strong> You collected <strong>$${deposit.toLocaleString()}</strong>, which exceeds the mandatory 1-month cap by <strong>$${excessAmount.toLocaleString()}</strong>.
          </div>
        `;
        if (elPenaltyBox) {
          elPenaltyBox.style.display = 'block';
          elPenaltyBox.innerHTML = `
            <div style="font-size:0.8125rem; color:#991b1b;">
              Under MD Real Property § 8-203, tenants may sue to recover up to <strong>3x the excess amount ($${potentialPenalty.toLocaleString()})</strong> plus reasonable attorney's fees.
            </div>
          `;
        }
      } else {
        elCapStatus.innerHTML = `
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:12px; color:#065f46; font-size:0.875rem;">
            <strong>✓ 100% COMPLIANT:</strong> Deposit is within Maryland's statutory 1-month limit ($${deposit.toLocaleString()} ≤ $${maxAllowedDeposit.toLocaleString()}).
          </div>
        `;
        if (elPenaltyBox) elPenaltyBox.style.display = 'none';
      }
    }

    if (elAccruedInterest) elAccruedInterest.textContent = `$${accruedInterest.toFixed(2)}`;
    if (elTotalDue) elTotalDue.textContent = `$${(deposit + accruedInterest).toFixed(2)}`;
    if (elReturnDeadline) elReturnDeadline.textContent = formatDate(returnDeadline);
    if (elDaysRemaining) {
      if (daysRemaining > 0) {
        elDaysRemaining.innerHTML = `<span style="color:#065f46; font-weight:700;">${daysRemaining} days remaining</span> to return deposit with itemized deductions.`;
      } else {
        elDaysRemaining.innerHTML = `<span style="color:#dc2626; font-weight:700;">OVERDUE by ${Math.abs(daysRemaining)} days!</span> Landlord forfeits right to withhold any deductions!`;
      }
    }

    const resultsBox = document.getElementById('depositCalcResults');
    if (resultsBox) resultsBox.style.display = 'block';
  };

  rentInput?.addEventListener('input', runCalculation);
  depositInput?.addEventListener('input', runCalculation);
  startDateInput?.addEventListener('change', runCalculation);
  endDateInput?.addEventListener('change', runCalculation);
  interestRateInput?.addEventListener('input', runCalculation);
  calcBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    runCalculation();
    showToast('Security deposit validated!');
  });

  runCalculation();
}

/* ==========================================================================
   CALCULATOR 3: LANDLORD ROI (SELF-MANAGED VS. BMG MANAGEMENT)
   ========================================================================== */
function initRoiCalculator() {
  const rentInput = document.getElementById('roiRent');
  const unitsInput = document.getElementById('roiUnits');
  const vacancyInput = document.getElementById('roiVacancyDays');
  const hoursInput = document.getElementById('roiHours');
  const hourlyRateInput = document.getElementById('roiHourlyRate');

  const runCalculation = () => {
    const monthlyRent = parseFloat(rentInput?.value || 2200);
    const units = parseInt(unitsInput?.value || 1, 10);
    const selfVacancyDays = parseFloat(vacancyInput?.value || 42); // avg self-managed days vacant
    const hours = parseFloat(hoursInput?.value || 8);
    const hourlyValue = parseFloat(hourlyRateInput?.value || 50);

    const grossAnnualRent = monthlyRent * 12 * units;

    // Self-managed vacancy loss: daily rent * vacancy days
    const dailyRent = (monthlyRent * 12) / 365;
    const selfVacancyCost = dailyRent * selfVacancyDays * units;

    // BMG average vacancy is only 21 days due to multi-platform syndication
    const bmgVacancyDays = 21;
    const bmgVacancyCost = dailyRent * bmgVacancyDays * units;
    const vacancySavings = Math.max(0, selfVacancyCost - bmgVacancyCost);

    // Value of owner's personal time spent dealing with tenants & maintenance
    const annualTimeCost = hours * 12 * hourlyValue * units;

    // BMG management fee (8% standard full service)
    const bmgAnnualFee = grossAnnualRent * 0.08;

    // Financial upside: Vacancy savings + Time saved + 99.8% on-time rent collections
    const netBenefit = (vacancySavings + annualTimeCost) - bmgAnnualFee;

    // Render results
    const elGross = document.getElementById('roiGrossRent');
    const elVacancySavings = document.getElementById('roiVacancySavings');
    const elTimeSavings = document.getElementById('roiTimeSavings');
    const elBmgFee = document.getElementById('roiBmgFee');
    const elNetBenefit = document.getElementById('roiNetBenefit');

    if (elGross) elGross.textContent = `$${grossAnnualRent.toLocaleString()}`;
    if (elVacancySavings) elVacancySavings.textContent = `+$${Math.round(vacancySavings).toLocaleString()}`;
    if (elTimeSavings) elTimeSavings.textContent = `+$${Math.round(annualTimeCost).toLocaleString()}`;
    if (elBmgFee) elBmgFee.textContent = `-$${Math.round(bmgAnnualFee).toLocaleString()}`;
    if (elNetBenefit) {
      if (netBenefit >= 0) {
        elNetBenefit.innerHTML = `<span style="color:#065f46;">+$${Math.round(netBenefit).toLocaleString()} / year</span> <small style="display:block; font-size:0.8rem; color:#64748b; font-weight:normal;">Net annual gain + 100% passive freedom</small>`;
      } else {
        elNetBenefit.innerHTML = `<span style="color:var(--bmg-primary);">$${Math.round(Math.abs(netBenefit)).toLocaleString()} / year</span> <small style="display:block; font-size:0.8rem; color:#64748b; font-weight:normal;">Modest cost for full professional management & eviction guarantee</small>`;
      }
    }
  };

  rentInput?.addEventListener('input', runCalculation);
  unitsInput?.addEventListener('input', runCalculation);
  vacancyInput?.addEventListener('input', runCalculation);
  hoursInput?.addEventListener('input', runCalculation);
  hourlyRateInput?.addEventListener('input', runCalculation);

  runCalculation();
}
