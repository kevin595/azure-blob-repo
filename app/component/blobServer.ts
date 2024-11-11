"use server";

import {
  AccountSASPermissions,
  AccountSASResourceTypes,
  AccountSASServices,
  AccountSASSignatureValues,
  BlobClient,
  BlobSASPermissions,
  BlobSASPermissionsLike,
  BlobServiceClient,
  generateAccountSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { headers } from "next/headers";

export const downloadPdfFile2 = async (
  fileName: string = "pexels-eberhard-grossgasteiger-844297.jpg"
): Promise<string> => {
  "use server";
  console.log("started sas");
  console.log("is it server or browser?");
  try {
    const CONTAINER_NAME = "pad-input2";
    const accountName = "lnhpocstorageaccount";
    const accountKey =
      "8gbAz/ESBA3+14sdlF0ilxecq+zfIIlBRhhuIZkm6arHHxKpFUcj7e4ybegF+eyp/aqWcYfr7jaa+ASt2dxs3Q==";

    // Create a SharedKeyCredential object
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const blobServiceClientNew = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const blobClient: BlobClient = blobServiceClientNew
      .getContainerClient(CONTAINER_NAME)
      .getBlobClient(fileName);

    // const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const permObj: BlobSASPermissionsLike = {
      add: true,
      read: true,
      write: true,
      execute: true,
      setImmutabilityPolicy: true,
      create: true,
    };
    // const permObj: BlobSASPermissions = {
    //   add: false,
    //   read: true,
    //   write: true,
    //   execute: true,
    //   create: false,
    //   delete: false,
    //   move: false,
    //   deleteVersion: false,
    //   permanentDelete: false,
    //   setImmutabilityPolicy: false,
    //   tag: false,
    // };

    const sasUrl = await blobClient.generateSasUrl({
      expiresOn: new Date(Date.now() + 3600 * 1000),
      startsOn: new Date(Date.now()),
      permissions: BlobSASPermissions.from(permObj),
      // ipRange: { start: "103.160.194.134", end: "103.160.194.134" },
    });
    console.log(`${sasUrl} sasurl`);
    return sasUrl;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const generateSasUrl = (): string => {
  const CONTAINER_NAME = "pad-input2";
  const accountName = "lnhpocstorageaccount";
  const accountKey =
    "8gbAz/ESBA3+14sdlF0ilxecq+zfIIlBRhhuIZkm6arHHxKpFUcj7e4ybegF+eyp/aqWcYfr7jaa+ASt2dxs3Q==";

  // Create a SharedKeyCredential object
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  const accountServicesPerm: AccountSASServices = {
    blob: true,
    file: false,
    queue: false,
    table: false,
  };

  const resourceTypesPerm: AccountSASResourceTypes = {
    container: true,
    object: false,
    service: false,
  };

  const permObj: AccountSASPermissions = {
    add: true,
    read: true,
    write: true,
    setImmutabilityPolicy: false,
    create: true,
    delete: false,
    deleteVersion: false,
    filter: false,
    list: false,
    permanentDelete: false,
    process: false,
    tag: false,
    update: false,
  };

  console.log("accnt perm", permObj.toString());

  const sasOptions: AccountSASSignatureValues = {
    services: AccountSASServices.parse("btqf").toString(), // blobs, tables, queues, files
    resourceTypes: AccountSASResourceTypes.parse("sco").toString(), // service, container, object
    permissions: AccountSASPermissions.parse("rwdlacupi"), // permissions
    protocol: SASProtocol.HttpsAndHttp, ///SASProtocol.Https
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 10 * 60 * 1000), // 10 minutes
    ipRange: { start: "103.160.194.134", end: "103.160.194.134" },
  };

  const sasToken = generateAccountSASQueryParameters(
    sasOptions,
    sharedKeyCredential
  ).toString();

  console.log(`sasToken = '${sasToken}'\n`);
  return sasToken;

  // const blobServiceClientNew = new BlockBlobClient(
  //   `https://${accountName}.blob.core.windows.net?${sasToken}`,
  //   sharedKeyCredential
  // );
};

export const getIP = (): string => {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    console.log("my ip ff", forwardedFor ?? FALLBACK_IP_ADDRESS);
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  console.log("my ip", headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS);
  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
};
