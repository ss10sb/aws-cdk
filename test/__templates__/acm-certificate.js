module.exports = {
    Resources: {
        certfoobarcom430629AB: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [{DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY'}],
                Tags: [{Key: 'Name', Value: 'stack/cert-foo.bar.com'}],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        }
    }
}
