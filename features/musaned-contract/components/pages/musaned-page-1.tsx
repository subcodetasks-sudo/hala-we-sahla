import BiTable from "../bi-table";
import BiRow from "../bi-row";
import ContractPage from "../contract-page";
import FieldUnderline from "../field-underline";
import type { MusanedContractData } from "../../types/musaned-contract";

type Props = {
  data: MusanedContractData;
};

export default function MusanedPage1({ data }: Props) {
  const emp = data.employer ?? {};
  const sa = data.saudiRecruitmentAgency ?? {};
  const dw = data.domesticWorker ?? {};
  const ph = data.philippineRecruitmentAgency ?? {};

  return (
    <ContractPage pageNumber={1} showFooterNumber>
      <BiTable>
        <BiRow
          shaded
          en={
            <div className="musaned-title">
              STANDARD EMPLOYMENT CONTRACT FOR THE FILIPINO
              <br />
              DOMESTIC WORKER BOUND FOR THE KINGDOM OF SAUDI
              <br />
              ARABIA
            </div>
          }
          ar={
            <div className="musaned-title-ar" dir="rtl" lang="ar">
              عقد عمل موحد للعاملة المنزلية الفلبينية المتجهة إلى المملكة
              <br />
              العربية السعودية
            </div>
          }
        />

        <BiRow
          shaded
          en={<>This employment contract is executed unto by and between:</>}
          ar={<>يتم تنفيذ عقد العمل هذا:</>}
        />

        <BiRow
          en={
            <div>
              <span className="musaned-bold">1. Name of Employer: </span>
              <FieldUnderline value={emp.name} widthCh={32} />
            </div>
          }
          ar={
            <div>
              <span className="musaned-bold">.1 اسم صاحب العمل: </span>
              <FieldUnderline value={emp.name} widthCh={28} dir="ltr" />
            </div>
          }
        />

        <BiRow
          en={
            <div>
              <div className="musaned-field-row">
                National ID No:{" "}
                <FieldUnderline value={emp.nationalId} widthCh={26} />
                <sup>1</sup>
              </div>
              <div className="musaned-field-row">
                Address&nbsp;&nbsp;&nbsp;&nbsp;:
                <FieldUnderline value={emp.address} widthCh={30} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={emp.addressLine2} widthCh={39} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={emp.addressLine3} widthCh={39} />
              </div>
              <div className="musaned-field-row">
                Civil Status:{" "}
                <FieldUnderline value={emp.civilStatus} widthCh={29} />
              </div>
              <div className="musaned-field-row">
                Contact Number:{" "}
                <FieldUnderline value={emp.contactNumber} widthCh={24} />
              </div>
            </div>
          }
          ar={
            <div>
              <div className="musaned-field-row">
                رقم الهوية الوطنية:{" "}
                <FieldUnderline value={emp.nationalId} widthCh={26} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                العنوان:{" "}
                <FieldUnderline value={emp.address} widthCh={28} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={emp.addressLine2}
                  widthCh={39}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={emp.addressLine3}
                  widthCh={39}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                الأحوال المدنية:{" "}
                <FieldUnderline value={emp.civilStatus} widthCh={27} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                رقم التواصل:{" "}
                <FieldUnderline
                  value={emp.contactNumber}
                  widthCh={29}
                  dir="ltr"
                />
              </div>
            </div>
          }
        />

        <BiRow
          en={
            <div>
              <div className="musaned-field-row">
                <span className="musaned-bold">● Represented by:</span>
              </div>
              <div className="musaned-field-row musaned-bold" style={{ marginTop: 8 }}>
                B. Name of Saudi Recruitment Agency:
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={sa.name} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                License No: <FieldUnderline value={sa.licenseNo} widthCh={25} />
              </div>
              <div className="musaned-field-row">
                ADDRESS: <FieldUnderline value={sa.address} widthCh={35} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={sa.addressLine2} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                Name of Official Representative:{" "}
                <FieldUnderline value={sa.officialRepresentative} widthCh={10} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                Contact Number:{" "}
                <FieldUnderline value={sa.contactNumber} widthCh={27} />
              </div>
              <div className="musaned-field-row">
                Passport Number:{" "}
                <FieldUnderline value={sa.passportNumber} widthCh={26} />
              </div>
              <div className="musaned-field-row">
                Date and Place of Issue:{" "}
                <FieldUnderline value={sa.dateAndPlaceOfIssue} widthCh={20} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                Address: <FieldUnderline value={sa.address} widthCh={37} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={sa.addressLine2} widthCh={48} />
              </div>
            </div>
          }
          ar={
            <div>
              <div className="musaned-field-row">
                <span className="musaned-bold">● ويمثلها:</span>
              </div>
              <div
                className="musaned-field-row musaned-bold"
                style={{ marginTop: 8 }}
              >
                ب. اسم الوكالة السعودية للتوظيف:{" "}
                <FieldUnderline value={sa.name} widthCh={20} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={35} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                رقم الترخيص:{" "}
                <FieldUnderline value={sa.licenseNo} widthCh={22} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                العنوان:{" "}
                <FieldUnderline value={sa.address} widthCh={26} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={sa.addressLine2}
                  widthCh={32}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                اسم الممثل الرسمي للوكالة:{" "}
                <FieldUnderline
                  value={sa.officialRepresentative}
                  widthCh={15}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={31} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                رقم الاتصال:{" "}
                <FieldUnderline
                  value={sa.contactNumber}
                  widthCh={22}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                رقم الجواز:{" "}
                <FieldUnderline
                  value={sa.passportNumber}
                  widthCh={24}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                تاريخ ومكان الإصدار:{" "}
                <FieldUnderline
                  value={sa.dateAndPlaceOfIssue}
                  widthCh={17}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={31} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                العنوان:{" "}
                <FieldUnderline value={sa.address} widthCh={26} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={sa.addressLine2}
                  widthCh={32}
                  dir="ltr"
                />
              </div>
            </div>
          }
        />

        <BiRow
          shaded
          en={
            <div>
              <span className="musaned-bold">
                C. Name of Domestic Worker:{" "}
              </span>
              <FieldUnderline value={dw.name} widthCh={18} />
            </div>
          }
          ar={
            <div>
              <span className="musaned-bold">.3 اسم العاملة المنزلية: </span>
              <FieldUnderline value={dw.name} widthCh={28} dir="ltr" />
            </div>
          }
        />

        <BiRow
          en={
            <div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                Address in the Philippines:{" "}
                <FieldUnderline value={dw.addressInPhilippines} widthCh={17} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={dw.addressInPhilippinesLine2}
                  widthCh={48}
                />
              </div>
              <div className="musaned-field-row">
                Civil Status:{" "}
                <FieldUnderline value={dw.civilStatus} widthCh={33} />
              </div>
              <div className="musaned-field-row">
                Contact Numbers:{" "}
                <FieldUnderline value={dw.contactNumbers} widthCh={26} />
              </div>
              <div className="musaned-field-row">
                Passport Number:{" "}
                <FieldUnderline value={dw.passportNumber} widthCh={26} />
              </div>
              <div className="musaned-field-row">
                Date and Place of Issue:{" "}
                <FieldUnderline value={dw.dateAndPlaceOfIssue} widthCh={20} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={48} />
              </div>
              <div className="musaned-field-row">
                Address: <FieldUnderline value={dw.address} widthCh={31} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={dw.addressLine2} widthCh={30} />
              </div>
            </div>
          }
          ar={
            <div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={29} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                العنوان في الفلبين:{" "}
                <FieldUnderline
                  value={dw.addressInPhilippines}
                  widthCh={18}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={dw.addressInPhilippinesLine2}
                  widthCh={29}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                الأحوال المدنية:{" "}
                <FieldUnderline value={dw.civilStatus} widthCh={19} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                أرقام الاتصال:{" "}
                <FieldUnderline
                  value={dw.contactNumbers}
                  widthCh={19}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                رقم جواز السفر:{" "}
                <FieldUnderline
                  value={dw.passportNumber}
                  widthCh={18}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                تاريخ ومكان الإصدار:{" "}
                <FieldUnderline
                  value={dw.dateAndPlaceOfIssue}
                  widthCh={15}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={29} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                عنوان:{" "}
                <FieldUnderline value={dw.address} widthCh={25} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={dw.addressLine2}
                  widthCh={24}
                  dir="ltr"
                />
              </div>
            </div>
          }
        />

        <BiRow
          shaded
          en={
            <div>
              <div className="musaned-bold" style={{ fontSize: "9pt" }}>
                D. Name of Philippine Recruitment Agency:
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={ph.name}
                  widthCh={35}
                  className="musaned-bold"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={undefined}
                  widthCh={45}
                  className="musaned-bold"
                />
              </div>
            </div>
          }
          ar={
            <div>
              <div className="musaned-bold">
                د. اسم وكالة التوظيف الفلبينية:{" "}
                <FieldUnderline value={ph.name} widthCh={14} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={34} dir="ltr" />
              </div>
            </div>
          }
        />

        <BiRow
          en={
            <div>
              <div className="musaned-field-row">
                License No: <FieldUnderline value={ph.licenseNo} widthCh={27} />
              </div>
              <div className="musaned-field-row">
                Address: <FieldUnderline value={ph.address} widthCh={30} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={ph.addressLine2} widthCh={42} />
              </div>
              <div className="musaned-field-row">
                Contact Number:{" "}
                <FieldUnderline value={ph.contactNumber} widthCh={21} />
              </div>
              <div className="musaned-field-row">
                Name of Official Representative:{" "}
                <FieldUnderline value={ph.officialRepresentative} widthCh={4} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={43} />
              </div>
              <div className="musaned-field-row">
                Passport Number:{" "}
                <FieldUnderline value={ph.passportNumber} widthCh={21} />
              </div>
              <div className="musaned-field-row">
                Date and place of issue:{" "}
                <FieldUnderline value={ph.dateAndPlaceOfIssue} widthCh={15} />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={43} />
              </div>
            </div>
          }
          ar={
            <div>
              <div className="musaned-field-row">
                رقم الترخيص:{" "}
                <FieldUnderline value={ph.licenseNo} widthCh={26} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                العنوان:{" "}
                <FieldUnderline value={ph.address} widthCh={26} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline
                  value={ph.addressLine2}
                  widthCh={31}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                رقم التواصل:{" "}
                <FieldUnderline
                  value={ph.contactNumber}
                  widthCh={26}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                اسم الممثل الرسمي للوكالة:{" "}
                <FieldUnderline
                  value={ph.officialRepresentative}
                  widthCh={17}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                <FieldUnderline value={undefined} widthCh={36} dir="ltr" />
              </div>
              <div className="musaned-field-row">
                رقم الجواز:{" "}
                <FieldUnderline
                  value={ph.passportNumber}
                  widthCh={23}
                  dir="ltr"
                />
              </div>
              <div className="musaned-field-row">
                تاريخ ومكان الإصدار:{" "}
                <FieldUnderline
                  value={ph.dateAndPlaceOfIssue}
                  widthCh={17}
                  dir="ltr"
                />
              </div>
            </div>
          }
        />
      </BiTable>
    </ContractPage>
  );
}
