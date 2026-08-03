import BiTable from "../bi-table";
import BiRow from "../bi-row";
import ContractPage from "../contract-page";
import FieldUnderline from "../field-underline";
import type { MusanedContractData } from "../../types/musaned-contract";

type Props = {
  data: MusanedContractData;
};

export default function MusanedPage2({ data }: Props) {
  return (
    <ContractPage pageNumber={2}>
      <BiTable>
        <BiRow
          shaded
          en={
            <span className="musaned-bold">
              Voluntarily binding themselves to the following terms and
              conditions:
            </span>
          }
          ar={
            <span className="musaned-bold">
              إلزام أنفسهم طواعية بالشروط والأحكام التالية:
            </span>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>1.</strong> Site of Employment:{" "}
                <FieldUnderline value={data.siteOfEmployment} widthCh={28} />
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .1 موقع التوظيف:{" "}
                <FieldUnderline
                  value={data.siteOfEmployment}
                  widthCh={28}
                  dir="ltr"
                />
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>2.</strong> Contact Duration: The duration of contract
                shall be for two (2) years effective from the date of departure
                of the worker from the Philippines.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .2 مدة الاتصال: تكون مدة العقد سنتين (2) سارية المفعول من تاريخ
                مغادرة العامل للفلبين.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>3.</strong> Duties and Responsibilities:
              </p>
              <p>
                The domestic worker shall perform the duties and responsibilities
                as shown in <strong>Annex &ldquo;A&rdquo;</strong> of this
                Contract.
              </p>
              <p>
                The employer shall have the duty of providing a safe living and
                work environment for the domestic worker, that is free from
                physical and psychological hazards. In particular, the domestic
                worker:
              </p>
              <ul className="musaned-list">
                <li>
                  <span className="musaned-marker">A.</span>
                  Shall not be assigned to carry out any dangerous work that
                  threatens his/her health, the integrity of his/her body, or
                  impair his/her human dignity;
                </li>
                <li>
                  <span className="musaned-marker">B.</span>
                  Shall not be allowed to perform domestic work for other
                  parties;
                </li>
                <li>
                  <span className="musaned-marker">C.</span>
                  Shall not be subjected to any form of discrimination and
                  harassment due to, among other things, gender, age, race and
                  religious beliefs; and
                </li>
                <li>
                  <span className="musaned-marker">D.</span>
                  Shall be provided with necessary and adequate assistance for
                  the protection of his/her physical and psychological health,
                  including access to timely medical and wellness service that
                  takes into account, among other things, his/her
                  gender-specific needs.
                </li>
              </ul>
              <p>
                Both the employer and domestic worker shall perform their
                reciprocal obligations with mutual respect for each other,
                including the domestic worker&apos;s duty to respect for the
                teachings of the Islamic religion, the regulations in force in
                the Kingdom, and the culture of the Saudi society.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>.3 الواجبات والمسؤوليات:</p>
              <p>
                على العامل المنزلي أن يؤدي الواجبات والمسؤوليات المبينة في{" "}
                <strong>الملحق &ldquo;أ&rdquo;</strong> من هذا العقد.
              </p>
              <p>
                على صاحب العمل واجب توفير بيئة معيشية وعمل آمنة للعاملة المنزلية،
                خالية من المخاطر الجسدية والنفسية. وعلى وجه الخصوص فإن العامل
                المنزلي:
              </p>
              <ul className="musaned-list musaned-list-ar">
                <li>
                  <span className="musaned-marker">.1</span>
                  لا يجوز تكليفه بالقيام بأي عمل خطير يهدد صحته أو سلامة جسده أو
                  ينال من كرامته الإنسانية؛
                </li>
                <li>
                  <span className="musaned-marker">.2</span>
                  لا يسمح له بأداء الأعمال المنزلية لأطراف أخرى؛
                </li>
                <li>
                  <span className="musaned-marker">.3</span>
                  لا يجوز أن يتعرض لأي شكل من أشكال التمييز والمضايقة بسبب أمور
                  منها نوع الجنس والعمر والعرق والمعتقدات الدينية؛ و
                </li>
                <li>
                  <span className="musaned-marker">.4</span>
                  يقدم له المساعدة اللازمة والكافية لحماية صحته البدنية والنفسية،
                  بما في ذلك الحصول على الخدمات الطبية والصحية في الوقت المناسب
                  التي تراعي، في جملة أمور، احتياجاته الخاصة بنوع الجنس.
                </li>
              </ul>
              <p>
                على كل من صاحب العمل والعامل المنزلي أداء التزاماتهما المتبادلة
                مع الاحترام المتبادل لبعضهما البعض، بما في ذلك واجب العامل المنزلي
                في احترام تعاليم الدين الإسلامي والأنظمة المعمول بها في المملكة،
                وثقافة المجتمع السعودي.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>4.</strong> Monthly Salary: The domestic worker and the
                employer agree on a monthly salary of SAR{" "}
                <FieldUnderline value={data.monthlySalary} widthCh={8} />
                , which is in accordance with the laws and regulations
                prevailing in both countries. The monthly salary shall start
                upon actual reporting to work, and shall be due at the end of
                each calendar month.
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .4 الراتب الشهري: يتفق العامل المنزلي وصاحب العمل على راتب شهري
                قدره{" "}
                <FieldUnderline
                  value={data.monthlySalary}
                  widthCh={8}
                  dir="ltr"
                />{" "}
                ريال،
                يبدأ الراتب الشهري عند الإبلاغ الفعلي عن العمل، ويكون مستحقا في
                نهاية كل شهر تقويمي.
              </p>
            </div>
          }
        />

        <BiRow
          en={
            <div className="musaned-clause">
              <p>
                <strong>5.</strong> Manner of Payment of Monthly Salary: The
                employer shall pay the monthly salary of the domestic worker by
                remitting or depositing to his/her bank or e-wallet account. The
                deposit slip or the proof of payment shall be given to the
                domestic worker. Upon request by the domestic worker, the
                employer shall help the domestic
              </p>
            </div>
          }
          ar={
            <div className="musaned-clause">
              <p>
                .5 طريقة صرف الراتب الشهري: يدفع صاحب العمل الراتب الشهري للعاملة
                المنزلية عن طريق التحويل أو الإيداع في حسابه المصرفي أو حساب
                محفظته الإلكترونية. وتعطى قسيمة الإيداع أو إثبات الدفع للعاملة
                المنزلية. بناء على طلب العامل المنزلي، يساعد صاحب العمل العامل
                المنزلي على تحويل راتبه إلى المستفيد في
              </p>
            </div>
          }
        />
      </BiTable>
    </ContractPage>
  );
}
