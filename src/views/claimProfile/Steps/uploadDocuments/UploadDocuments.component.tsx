'use client';
import React, { useState } from 'react';
import styles from './UploadDocuments.module.scss';
import useApiHook from '@/hooks/useApi';
import { useUserStore } from '@/state/user';
import axios from '@/utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const DOCUMENT_TYPES = ["Driver's License", 'Passport', 'Social Security Card', 'State ID', 'Military ID', 'Other Government-Issued ID'];

type DocumentUpload = {
  type: string;
  file: File | null;
};

const UploadDocuments = ({ handleNext, handleBack }: { handleNext: () => void; handleBack: () => void }) => {
  const searchParams = useSearchParams();
  const profile = searchParams.get('slug');
  const queryClient = useQueryClient();
  const claim = queryClient.getQueryData(['profile', profile as string]) as { payload: { _id: string } } | undefined;
  const { user } = useUserStore((state) => state);
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: '', file: null },
    { type: '', file: null },
  ]);

  const { mutate: uploadDocuments } = useApiHook({
    method: 'POST',
    key: 'uploadDocuments',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${user?.token}`,
    },
  }) as any;

  const { mutate: updateClaim } = useApiHook({
    method: 'PUT',
    key: 'updateClaim',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
    queriesToInvalidate: ['profile', profile as string],
  }) as any;

  const updateDocument = (index: number, newData: Partial<DocumentUpload>) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], ...newData };
    setDocuments(updated);
  };
  const canSubmit = documents.every((doc) => doc.type && doc.file);

  const handleSubmit = async () => {
    const formData = new FormData();
    documents.forEach((doc, index) => {
      formData.append(`document${index + 1}`, doc.file as File);
      formData.append(`type${index + 1}`, doc.type);
    });

    try {
      await uploadDocuments(
        {
          url: '/upload/cloudinary/file',
          formData: formData,
        },
        {
          onSuccess: async (response: any) => {
            console.log('Documents uploaded successfully:', response);
            // Assuming the response contains the URLs of the uploaded documents, we need to conform the data to the claim.documents type
            const documentUrls = response.payload.map((doc: any, index: number) => ({
              url: doc.url,
              fileName: doc.fileName,
              type: doc.type,
            }));

            // Update the claim with the document URLs
            await updateClaim(
              {
                url: `/auth/claim/${claim?.payload?._id as any}`,
                formData: { documents: documentUrls, status: 'pending'},
              },
              {
                onSuccess: () => {
                  console.log('Claim updated successfully with document URLs');
                  handleNext();
                },
                onError: (error: any) => {
                  console.error('Error updating claim:', error);
                },
              }
            );
          },
          onError: (error: any) => {
            console.error('Error uploading documents:', error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Verification Documents</h2>
      <p className={styles.instructions}>Please upload two valid forms of government-issued identification.</p>

      {documents.map((doc, index) => (
        <div key={index} className={styles.documentGroup}>
          <label className={styles.label}>Select document type:</label>
          <select className={styles.select} value={doc.type} onChange={(e) => updateDocument(index, { type: e.target.value })}>
            <option value="">-- Select --</option>
            {DOCUMENT_TYPES.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label className={styles.label}>Upload file:</label>
          <input className={styles.input} type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => updateDocument(index, { file: e.target.files?.[0] || null })} />
        </div>
      ))}

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.secondary}`} onClick={handleBack}>
          Back
        </button>
        <button className={`${styles.button} ${styles.primary}`} onClick={handleSubmit} disabled={!canSubmit}>
          Submit Documents
        </button>
      </div>
    </div>
  );
};

export default UploadDocuments;
