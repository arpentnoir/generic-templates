import { TemplateProps } from '@govtechsg/decentralized-renderer-react-components';
import { v3 } from '@govtechsg/open-attestation';
import React, { FunctionComponent, useState } from 'react';
import { DocumentSegment, DocumentSummary } from '../../common/components';
import { formatDate, getValue } from '../../common/utils/utils';

export interface PostalAddress {
  line1: string;
  line2?: string;
  cityName: string;
  postcode: string;
  countrySubDivisionName?: string;
  countryCode: string;
}
export interface Entity {
  iD: string;
  name: string;
  postalAddress: PostalAddress;
}
export interface Consignments {
  iD: string;
  information: string;
  crossBorderRegulatoryProcedure: {
    originCriteriaText: string;
  };
  manufacturer: {
    iD: string;
    name: string;
    postalAddress: PostalAddress;
  };
  tradeLineItems: TradeLineItems[];
}
export interface TradeLineItems {
  sequenceNumber: number;
  invoiceReference: {
    iD: string;
    formattedIssueDateTime?: string;
    issueDateTime?: string;
    attachedBinaryFile: {
      uRI: string;
    };
  };
  tradeProduct: {
    iD: string;
    description: string;
    harmonisedTariffCode: {
      classCode: string;
      className: string;
    };
    originCountry: {
      code: string;
    };
  };
  transportPackages: {
    iD: string;
    grossVolume: string;
    grossWeight: string;
  }[];
}
export interface AANZFTACertificateOfOriginDoc
  extends v3.OpenAttestationDocument {
  credentialSubject: {
    iD: string;
    issueDateTime: string;
    name?: string;
    firstSignatoryAuthentication: {
      signature: string;
      actualDateTime: string;
    };
    secondSignatoryAuthentication: {
      signature: string;
      actualDateTime: string;
    };
    isPreferential?: boolean;
    supplyChainConsignment: {
      iD: string;
      information: string;
      exportCountry: {
        code?: string;
        name?: string;
      };
      consignor: Entity;
      importCountry: {
        code?: string;
        name?: string;
      };
      consignee: Entity;
      includedConsignmentItems: Consignments[];
      loadingBaseportLocation: {
        iD: string;
        name: string;
      };
      mainCarriageTransportMovement: {
        iD: string;
        information: string;
        usedTransportMeans: {
          iD: string;
          name: string;
        };
        departureEvent: {
          departureDateTime: string;
        };
      };
      unloadingBaseportLocation: {
        iD: string;
        name: string;
      };
    };
    links?: {
      self?: {
        href?: string;
      };
    };
  };
}
interface ConsinmentRenderItem {
  ItemNumber?: number;
  Marks?: string;
  Kinds?: string;
  Origin?: string;
  Quantity?: string;
  InvoiceNum?: string;
  InvoiceDate?: string;
}

export const ConsinmentsRender: FunctionComponent<{
  consinments: Consignments[];
}> = ({ consinments }) => {
  const items: ConsinmentRenderItem[] = [];
  consinments?.forEach(consignmentItem => {
    const { tradeLineItems } = consignmentItem;
    tradeLineItems?.forEach(tradeLineItem => {
      const { transportPackages, tradeProduct } = tradeLineItem;
      const flData = {
        ItemNumber: tradeLineItem.sequenceNumber,
        Kinds: tradeProduct?.description,
        Origin:
          consignmentItem.crossBorderRegulatoryProcedure.originCriteriaText
      };

      transportPackages?.forEach((transportPackage, index) => {
        items.push({
          Marks: getValue(transportPackage.iD),
          Quantity: `${transportPackage.grossVolume}, ${transportPackage.grossWeight}`,
          InvoiceDate: formatDate(
            tradeLineItem.invoiceReference?.issueDateTime
          ),
          InvoiceNum: getValue(tradeLineItem.invoiceReference?.iD),
          ...(index === 0 ? flData : {})
        });
      });
    });
  });
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 0.1 }} className={`p-2 border `}>
          5. Item number
        </div>
        <div style={{ flex: 0.15 }} className={`p-2 border`}>
          6. Marks and numbers on packages
        </div>
        <div style={{ flex: 0.35 }} className={`p-2 border`}>
          7. Number and kind of packages; description of goods including HS Code
          (6 digits) and brand name (if applicable). Name of company issuing
          third party invoice (if applicable)
        </div>
        <div style={{ flex: 0.15 }} className={`p-2 border`}>
          8. Origin Conferring Criterion (see Overleaf Notes)
        </div>
        <div style={{ flex: 0.3 }} className={`p-2 border`}>
          9. Quantity (Gross weight or other measurement), and value (FOB) where
          RVC is applied (see Overleaf Notes)
        </div>
        <div style={{ flex: 0.15 }} className={`p-2 border`}>
          10. Invoice number(s) and date of invoice(s)
        </div>
      </div>
      {items.map((line, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              flex: 0.1,
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2 border-l"
          >
            {line.ItemNumber}
          </div>
          <div
            style={{
              flex: 0.15,
              wordBreak: 'break-all',
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2"
          >
            {line.Marks}
          </div>
          <div
            style={{
              flex: 0.35,
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2"
          >
            {line.Kinds}
          </div>
          <div
            style={{
              flex: 0.15,
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2"
          >
            {line.Origin}
          </div>
          <div
            style={{
              flex: 0.3,
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2"
          >
            {line.Quantity}
          </div>
          <div
            style={{
              flex: 0.15,
              borderLeftWidth: '1px',
              borderRightWidth: '1px'
            }}
            className="p-2"
          >
            <div>{line.InvoiceNum}</div>
            <div>{line.InvoiceDate}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export const EntityRender: FunctionComponent<{ exporter?: Entity }> = ({
  exporter
}) => {
  return (
    <>
      <p>{exporter?.name}</p>
      <p>{exporter?.postalAddress?.line1}</p>
      <p>{exporter?.postalAddress?.line2}</p>
      <p>{exporter?.postalAddress?.cityName}</p>
      <p>
        {exporter?.postalAddress?.countrySubDivisionName}{' '}
        {exporter?.postalAddress?.postcode}{' '}
        {exporter?.postalAddress?.countryCode}
      </p>
      {exporter?.iD && <p>ABN {getValue(exporter?.iD)}</p>}
    </>
  );
};

// TODO: Determine if we are adding redaction functionality.
//       If we aren't, remove PrivacyFilter, handleObfuscation & editable.
//       If we are, uncomment PrivacyFilter & add setEditable to destructured state array.
export const AANZFTACertificateOfOrigin: FunctionComponent<TemplateProps<
  AANZFTACertificateOfOriginDoc
> & {
  className?: string;
}> = ({ document, handleObfuscation }) => {
  const [editable] = useState(false);

  const supplyChainConsignment =
    document?.credentialSubject?.supplyChainConsignment;
  const exporter = supplyChainConsignment.consignor;
  const importer = supplyChainConsignment.consignee;
  const transportMovment = supplyChainConsignment.mainCarriageTransportMovement;
  const consinments = supplyChainConsignment.includedConsignmentItems;

  return (
    <div className="AANZFTAContainer">
      {/* 
      <PrivacyFilter
        editable={editable}
        onToggleEditable={() => setEditable(!editable)}
      /> */}
      <div className="text-center mt-4">
        <h1 style={{ fontSize: '0.9em', fontWeight: 'bolder' }}>
          CERTIFICATE OF ORIGIN
        </h1>
      </div>
      <div className="border m-2" style={{ width: '210mm' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', flex: 1 }}>
            <DocumentSegment
              sectionTitle={
                '1. Goods Consigned from (Exporter’s name, address and country)'
              }
              sectionBody={<EntityRender exporter={exporter} />}
              handleObfuscation={() => {
                handleObfuscation(
                  'credentialSubject.supplyChainConsignment.consignor'
                );
              }}
              minBodyHeight={0}
              edit={!!exporter && editable}
              redacted={!exporter}
            />
            <DocumentSegment
              sectionTitle={
                '2. Goods Consigned to (Importer’s/ Consignee’s name, address, country)'
              }
              sectionBody={<EntityRender exporter={importer} />}
              handleObfuscation={() =>
                handleObfuscation(
                  'credentialSubject.supplyChainConsignment.consignee'
                )
              }
              minBodyHeight={0}
              edit={!!importer && editable}
              redacted={!importer}
            />
          </div>
          <div className="w-1/2" style={{ width: '50%' }}>
            <DocumentSummary
              certificateNo={getValue(document.credentialSubject.iD)}
              title={
                <>
                  <h2 style={{ fontWeight: 'bold' }}>
                    AGREEMENT ESTABLISHING THE ASEAN – AUSTRALIA–NEW ZEALAND
                    FREE TRADE AREA (AANZFTA)
                  </h2>
                  <h2 style={{ fontWeight: 'bold', marginTop: 10 }}>
                    CERTIFICATE OF ORIGIN
                  </h2>
                  <div>(Combined Declaration and Certificate)</div>
                </>
              }
              issuedIn={
                supplyChainConsignment.exportCountry.name
                  ? supplyChainConsignment.exportCountry.name
                  : ''
              }
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', flex: 1 }}>
            <DocumentSegment
              sectionTitle={'3. Means of transport and route (if known)'}
              edit={false}
              handleObfuscation={() => null}
              sectionBody={
                <>
                  <div>
                    Shipment Date:{' '}
                    {formatDate(
                      transportMovment.departureEvent.departureDateTime
                    )}
                  </div>
                  <div>
                    Vessel’s name/Aircraft etc.:{' '}
                    {getValue(transportMovment.usedTransportMeans.iD)}
                  </div>
                  <div>
                    Port of Discharge:{' '}
                    {getValue(
                      supplyChainConsignment.loadingBaseportLocation.iD
                    )}
                  </div>
                </>
              }
            />
          </div>
          <div style={{ width: '50%', flex: 1 }}>
            <DocumentSegment
              sectionTitle={'4. For Official Use'}
              edit={false}
              handleObfuscation={() => null}
              sectionBody={
                <>
                  <div>
                    <input
                      type="checkbox"
                      name="checkbox1"
                      id="c1"
                      checked={document?.credentialSubject?.isPreferential}
                      disabled
                    />{' '}
                    <label htmlFor="c1">
                      Preferential Treatment Given Under AANZFTA
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name="checkbox12"
                      id="c2"
                      checked={!document?.credentialSubject?.isPreferential}
                      disabled
                    />{' '}
                    <label htmlFor="c2">
                      Preferential Treatment Not Given (Please state reason/s)
                    </label>
                  </div>
                </>
              }
            />
          </div>
        </div>
        <div>
          <ConsinmentsRender consinments={consinments} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', flex: 1 }}>
            <DocumentSegment
              sectionTitle={'11. Declaration by the exporter'}
              sectionBody={
                <>
                  <p>
                    The undersigned hereby declares that the above details and
                    statements are correct; that all the goods were produced in
                  </p>
                  <div className="my-8 text-center">
                    <br />
                    <p>{supplyChainConsignment?.exportCountry?.name}</p>
                    <p>( country )</p>
                    <p>
                      and that they comply with the rules of origin, as provided
                      in Chapter 3 of the Agreement Establishing the ASEAN-
                      Australia-New Zealand Free Trade Area for the goods
                      exported to
                    </p>
                    <br />
                    <p>{supplyChainConsignment?.importCountry?.name}</p>
                    <p>( importing country )</p>
                    <div className="my-4">
                      <p>
                        {supplyChainConsignment?.loadingBaseportLocation?.name}
                        {supplyChainConsignment?.loadingBaseportLocation
                          ?.name &&
                          document?.credentialSubject
                            .firstSignatoryAuthentication?.actualDateTime &&
                          `, `}
                        {formatDate(
                          document?.credentialSubject
                            .firstSignatoryAuthentication?.actualDateTime
                        )}
                      </p>
                      <div style={{ minHeight: '80px' }}>
                        <img
                          className="w-1/2 mx-auto"
                          data-testid="signature"
                          src={
                            document?.credentialSubject
                              .firstSignatoryAuthentication?.signature
                          }
                        />
                      </div>
                    </div>
                    <p>
                      Place and date, name, signature and company of authorised
                      signatory
                    </p>
                  </div>
                </>
              }
              edit={false}
              handleObfuscation={() => null}
            />
          </div>
          <div style={{ width: '50%', flex: 1 }}>
            <DocumentSegment
              sectionTitle={'12. Certification'}
              height={'100%'}
              edit={false}
              handleObfuscation={() => null}
              sectionBody={
                <>
                  <p>
                    On the basis of control carried out, it is hereby certified
                    that the information herein is correct and that the goods
                    described comply with the origin requirements specified in
                    the Agreement Establishing the ASEAN-Australia-New Zealand
                    Free Trade Area.
                  </p>
                  <div className="flex-grow">
                    <img
                      className="w-1/2 mx-auto"
                      src={
                        document.credentialSubject.secondSignatoryAuthentication
                          .signature
                      }
                    />
                  </div>
                  <p>
                    Place and date, signature and stamp of Authorised Issuing
                    Authority/ Body
                  </p>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
