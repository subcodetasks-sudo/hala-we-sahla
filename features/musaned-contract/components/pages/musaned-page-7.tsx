import BiTable from "../bi-table";
import BiRow from "../bi-row";
import ContractPage from "../contract-page";
import type { MusanedContractData } from "../../types/musaned-contract";

type Props = {
  data: MusanedContractData;
};

export default function MusanedPage7({ data }: Props) {
  const sig = data.signatures ?? {};

  return (
    <ContractPage pageNumber={7}>
      <BiTable>
        <BiRow
          shaded
          en={
            <div>
              <div className="musaned-bold">Saudi Recruitment Agency</div>
              <div>
                Date signed:{" "}
                <span
                  style={{
                    display: "inline-block",
                    minWidth: "14ch",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {sig.saudiRecruitmentAgency || "\u00A0"}
                </span>
              </div>
            </div>
          }
          ar={
            <div>
              <div>(التوقيع فوق الاسم المطبوع)</div>
              <div className="musaned-bold">الوكالة السعودية للتوظيف</div>
              <div>
                تاريخ التوقيع:{" "}
                <span
                  className="musaned-ltr-value"
                  dir="ltr"
                  style={{
                    display: "inline-block",
                    minWidth: "14ch",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {sig.saudiRecruitmentAgency || "\u00A0"}
                </span>
              </div>
            </div>
          }
        />
        <BiRow en={<div style={{ minHeight: 56 }} />} ar={<div style={{ minHeight: 56 }} />} />
      </BiTable>
    </ContractPage>
  );
}
