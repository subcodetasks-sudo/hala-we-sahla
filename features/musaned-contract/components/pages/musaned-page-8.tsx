import ContractPage from "../contract-page";
import type { MusanedContractData } from "../../types/musaned-contract";

type Props = {
  data: MusanedContractData;
};

function ynMark(value: boolean | null | undefined) {
  if (value === true) return <>(<u>Y</u>)&nbsp;&nbsp;N</>;
  if (value === false) return <>Y&nbsp;&nbsp;(<u>N</u>)</>;
  return <>Y&nbsp;&nbsp;N</>;
}

export default function MusanedPage8({ data }: Props) {
  const annex = data.annex ?? {};
  const duties = annex.duties ?? {};
  const other = annex.otherDuties ?? ["", "", "", ""];

  const employerName = annex.employerName ?? data.employer?.name;
  const employerNationalId =
    annex.employerNationalId ?? data.employer?.nationalId;
  const employerContact =
    annex.employerContactNo ?? data.employer?.contactNumber;
  const workerName = annex.workerName ?? data.domesticWorker?.name;
  const workerPassport =
    annex.workerPassportNo ?? data.domesticWorker?.passportNumber;
  const salary = annex.monthlySalary ?? data.monthlySalary;
  const duration = annex.contractDuration ?? "2 years";

  return (
    <ContractPage pageNumber={8}>
      <div className="musaned-annex">
        <header className="musaned-annex-header">
          <div>
            ANNEX &ldquo;A&rdquo; Of the Standard Employment Contract for Filipino
          </div>
          <div>
            Domestic Workers (DW) Bound for the Kingdom of Saudi Arabia
          </div>
          <div className="musaned-ar-line" dir="rtl" lang="ar">
            الملحق &ldquo;أ&rdquo; من عقد العمل الخاص بالعمالة المنزلية من الفلبين
            المغادرة للمملكة
          </div>
          <div className="musaned-ar-line" dir="rtl" lang="ar">
            العربية السعودية
          </div>
        </header>

        <h2 className="musaned-annex-section-title">
          DOMESTIC WORKER&apos;S DUTIES AND RESPONSIBILITIES / واجبات ومسؤوليات
          العامل المنزلي
        </h2>

        <div className="musaned-annex-cols">
          <div>
            <span className="musaned-annex-label">
              Name of the Domestic Employer
            </span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              اسم صاحب العمل
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {employerName || "\u00A0"}
            </span>
          </div>
          <div>
            <span className="musaned-annex-label">National ID No.</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              رقم الهوية
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {employerNationalId || "\u00A0"}
            </span>
          </div>
          <div>
            <span className="musaned-annex-label">Contact No.</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              رقم التواصل
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {employerContact || "\u00A0"}
            </span>
          </div>
        </div>

        <h3
          style={{
            textAlign: "center",
            fontWeight: 700,
            margin: "8px 0 18px",
          }}
        >
          Domestic Worker&apos;s Details / بيانات العامل المنزلي
        </h3>

        <div className="musaned-annex-cols musaned-annex-cols-4">
          <div>
            <span className="musaned-annex-label">Name</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              الاسم
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {workerName || "\u00A0"}
            </span>
          </div>
          <div>
            <span className="musaned-annex-label">Passport No.</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              رقم الجواز
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {workerPassport || "\u00A0"}
            </span>
          </div>
          <div>
            <span className="musaned-annex-label">Monthly Salary</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              الأجر الشهري
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {salary || "\u00A0"}
            </span>
          </div>
          <div>
            <span className="musaned-annex-label">Contract Duration</span>
            <span className="musaned-annex-label-ar" dir="rtl" lang="ar">
              مدة العقد
            </span>
            <span className="musaned-annex-value" dir="ltr">
              {duration || "\u00A0"}
            </span>
          </div>
        </div>

        <h3
          style={{
            textAlign: "center",
            fontWeight: 700,
            margin: "4px 0 8px",
          }}
        >
          Duties and Responsibilities of the Domestic Worker / واجبات ومسؤوليات
          العامل المنزلي
        </h3>

        <div className="musaned-duty-list">
          <div className="musaned-duty-row">
            <span>Cleaning / التنظيف</span>
            <span className="musaned-duty-yn">{ynMark(duties.cleaning)}</span>
          </div>
          <div className="musaned-duty-row">
            <span>Washing &amp; Ironing / الغسيل والكي</span>
            <span className="musaned-duty-yn">
              {ynMark(duties.washingIroning)}
            </span>
          </div>
          <div className="musaned-duty-row">
            <span>Cooking / الطبخ</span>
            <span className="musaned-duty-yn">{ynMark(duties.cooking)}</span>
          </div>
          <div className="musaned-duty-row">
            <span>
              Babysitting or Children Care / مجالسة أو رعاية الأطفال
            </span>
            <span className="musaned-duty-yn">{ynMark(duties.babysitting)}</span>
          </div>
          <div className="musaned-duty-row">
            <span>Elderly Care / رعاية المسنين</span>
            <span className="musaned-duty-yn">{ynMark(duties.elderlyCare)}</span>
          </div>
        </div>

        <h3
          style={{
            textAlign: "center",
            fontWeight: 700,
            margin: "16px 0 8px",
          }}
        >
          Other Duties and Responsibilities of the Domestic Worker / واجبات
          ومسؤوليات العامل المنزلي الأخرى
        </h3>

        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="musaned-other-duty">
            {i + 1}.{" "}
            <span
              style={{
                display: "inline-block",
                minWidth: "85%",
                borderBottom: "1px solid #000",
                paddingBottom: 2,
              }}
            >
              {other[i] || "\u00A0"}
            </span>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 28,
            fontWeight: 700,
          }}
        >
          <span>Signatures:</span>
          <span dir="rtl" lang="ar" style={{ fontFamily: "var(--musaned-font-ar)" }}>
            التوقيعات:
          </span>
        </div>

        <table className="musaned-sig-table">
          <tbody>
            <tr>
              <td>
                <span className="ar" dir="rtl" lang="ar">
                  توقيع العامل المنزلي
                </span>
                <span className="en">
                  Domestic Worker&apos;s Name and Signature
                </span>
              </td>
              <td>
                <span className="ar" dir="rtl" lang="ar">
                  توقيع ممثل وكالة تصدير العمالة في الفلبين
                </span>
                <span className="en">Philippine Recruitment Agency Signature</span>
              </td>
              <td>
                <span className="ar" dir="rtl" lang="ar">
                  توقيع ممثل المرخص له بنشاط الاستقدام السعودي
                </span>
                <span className="en">Saudi Recruitment Agency Signature</span>
              </td>
              <td>
                <span className="ar" dir="rtl" lang="ar">
                  توقيع صاحب العمل
                </span>
                <span className="en">
                  Domestic Employer&apos;s Name and Signature
                </span>
              </td>
            </tr>
            <tr className="musaned-sig-blank">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContractPage>
  );
}
