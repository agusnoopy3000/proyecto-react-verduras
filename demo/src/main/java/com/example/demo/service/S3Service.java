package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public String subirArchivo(MultipartFile archivo) throws IOException {
        String clave = "productos/" + UUID.randomUUID() + "-" + archivo.getOriginalFilename();

        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(clave)
                .contentType(archivo.getContentType())
                .build();

        s3Client.putObject(por, RequestBody.fromBytes(archivo.getBytes()));

        return "https://" + bucketName + ".s3.amazonaws.com/" + clave;
    }
}