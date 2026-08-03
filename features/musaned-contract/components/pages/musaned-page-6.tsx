import BiTable from "../bi-table";
import BiRow from "../bi-row";
import ContractPage from "../contract-page";
import type { MusanedContractData } from "../../types/musaned-contract";

type Props = {
  data: MusanedContractData;
};

export default function MusanedPage6({ data }: Props) {
  const sig = data.signatures ?? {};

  return (
    <ContractPage pageNumber={6}>
      <BiTable>
        <BiRow
          en={
            <div className="musaned-clause">
              <ul className="musaned-list">
                <li>
                  <span className="musaned-marker">1.</span>
                  the rights of domestic workers, including the right to
                  equality, non-discrimination, and to protection from abuse; and
                </li>
                <li>
                  <span className="musaned-marker">2.</span>
                  on everyone&apos;s obligation to immediately report cases of
                  abuse that come to their knowledge to the competent
                  authorities.
                </li>
              </ul>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <ul className="musaned-list musaned-list-ar">
                <li>
                  <span className="musaned-marker">.1</span>
                  حقوق عاملات المنازل بما في ذلك الحق في المساواة وعدم التمييز
                  والحماية من الانتهاكات؛ و
                </li>
                <li>
                  <span className="musaned-marker">.2</span>
                  التزام الجميع بالإبلاغ فورا عن حالات الإساءة التي تصل إلى علمهم
                  إلى السلطات المختصة.
                </li>
              </ul>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>17.</strong> Any provision of this Standard Employment
                Contract may be altered, amended or substituted through the
                Saudi–Philippine Joint Technical Working Committee.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .17 يجوز تغيير أي حكم من أحكام عقد العمل الموحد هذا أو تعديله أو
                استبداله من خلال لجنة العمل الفنية السعودية الفلبينية المشتركة.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>18.</strong> The worker shall be repatriated at the
                employer&apos;s expense in the event of war, civil disturbance or
                major natural calamity, pandemic or other analogous circumstances
                or in case the worker suffers from serious illness or work injury
                medically proven to render him/her incapable of completing the
                contract.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .18 يعاد العامل إلى وطنه على نفقة صاحب العمل في حالة الحرب أو
                الاضطرابات المدنية أو الكوارث الطبيعية الكبرى أو الجائحة أو غيرها
                من الظروف المماثلة أو في حالة تعرض العامل لمرض خطير أو إصابة عمل
                يثبت طبيا أنها تجعله غير قادر على إكمال العقد.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>19.</strong> After the expiration of the contract and the
                domestic worker desire to return to the Philippines, the employer
                and/or the Saudi Recruitment Agency shall present to the MWO the
                proof of full payment of salaries of the worker. Such bank
                statement and proof of settlement may be submitted as evidence in
                the Philippines and in the KSA.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .19 بعد انتهاء العقد ورغبة العاملة المنزلية في العودة إلى الفلبين،
                يجب على صاحب العمل و/أو وكالة الاستقدام السعودية أن تقدم إلى وزارة
                العمل دليل الدفع الكامل لرواتب العاملة. يمكن تقديم هذا البيان
                المصرفي وإثبات التسوية كدليل في الفلبين والمملكة العربية السعودية.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>20.</strong> This contract may be renewed upon the
                agreement of the worker and his/her employer. Should the contract
                be renewed, a copy of the renewed iqama and proof of full payment
                of salaries shall be submitted to the MWO/Philippine
                Embassy/Consulate by the employer or Saudi recruitment agency.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .20 يجوز تجديد هذا العقد بموافقة العامل وصاحب العمل. في حالة تجديد
                العقد، يجب تقديم نسخة من الإقامة المجددة وإثبات الدفع الكامل
                للرواتب إلى MWO / السفارة / القنصلية الفلبينية من قبل صاحب العمل
                أو وكالة التوظيف السعودية.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>21.</strong> This contract shall be written in to two
                original copies in the English and Arabic text, both copies being
                equally authentic.
              </p>
              <p style={{ marginTop: 12 }}>Signed by:</p>

              <div className="musaned-sig-block">
                <div>(Signature over printed name)</div>
                <div className="musaned-bold">Domestic Worker</div>
                <div>
                  Date signed:{" "}
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.domesticWorker || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="musaned-sig-block">
                <div>(Signature over printed name)</div>
                <div className="musaned-bold">Employer</div>
                <div>
                  Date signed:{" "}
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.employer || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="musaned-sig-block">
                <div>(Signature over printed name)</div>
                <div className="musaned-bold">Philippine Recruitment Agency</div>
                <div>
                  Date signed:{" "}
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.philippineRecruitmentAgency || "\u00A0"}
                  </span>
                </div>
              </div>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .21 يكتب هذا العقد في نسختين أصليتين بالنص الإنجليزي والعربي، على
                أن تكون النسختان متساويتين في الحجية.
              </p>
              <p style={{ marginTop: 12 }}>وقع من:</p>

              <div className="musaned-sig-block">
                <div>(التوقيع فوق الاسم المطبوع)</div>
                <div className="musaned-bold">العمالة المنزلية</div>
                <div>
                  تاريخ التوقيع:{" "}
                  <span
                    className="musaned-ltr-value"
                    dir="ltr"
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.domesticWorker || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="musaned-sig-block">
                <div>(التوقيع فوق الاسم المطبوع)</div>
                <div className="musaned-bold">المستخدم</div>
                <div>
                  تاريخ التوقيع:{" "}
                  <span
                    className="musaned-ltr-value"
                    dir="ltr"
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.employer || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="musaned-sig-block">
                <div>(التوقيع فوق الاسم المطبوع)</div>
                <div className="musaned-bold">وكالة التوظيف الفلبينية</div>
                <div>
                  تاريخ التوقيع:{" "}
                  <span
                    className="musaned-ltr-value"
                    dir="ltr"
                    style={{
                      display: "inline-block",
                      minWidth: "12ch",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    {sig.philippineRecruitmentAgency || "\u00A0"}
                  </span>
                </div>
              </div>
            </div>
          }
        />
      </BiTable>
    </ContractPage>
  );
}
