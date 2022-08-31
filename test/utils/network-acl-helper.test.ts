import {AclCidr, AclTraffic, SubnetType, TrafficDirection} from "aws-cdk-lib/aws-ec2";
import {NetworkAclHelper} from "../../src/utils/network-acl-helper";
import {NaclRulesProps} from "../../src/vpc/vpc-definitions";
import {NaclCidr} from "../../src/vpc/nacl-cidr";

describe('network acl helper', () => {

    it('can create vpc cidr', () => {
        const naclRules: NaclRulesProps[] = [
            {
                groupName: 'vpc',
                subnetSelection: {
                    subnetType: SubnetType.PUBLIC
                },
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(80),
                        cidrs: [
                            () => NaclCidr.vpcCidr()
                        ]
                    }
                ]
            }
        ];
        const helper = new NetworkAclHelper('172.19.0.0/16');
        const result = helper.create(naclRules);
        expect(result[0].rules[0].cidr.toCidrConfig().cidrBlock).toEqual('172.19.0.0/16');
    });

    it('can create network acls', () => {
        const naclRules: NaclRulesProps[] = [
            {
                groupName: 'shared',
                subnetSelection: {},
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.icmp({code: -1, type: -1}),
                        cidrs: [
                            AclCidr.ipv4("172.22.160.0/24"),
                            AclCidr.ipv4("172.22.161.0/24"),
                            AclCidr.ipv4("10.150.0.0/22")
                        ]
                    },
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPortRange(1024, 65535),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.EGRESS,
                        traffic: AclTraffic.tcpPort(53),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.EGRESS,
                        traffic: AclTraffic.udpPort(53),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.EGRESS,
                        traffic: AclTraffic.tcpPort(80),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.EGRESS,
                        traffic: AclTraffic.tcpPort(443),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.EGRESS,
                        traffic: AclTraffic.tcpPortRange(1024, 65535),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    }
                ]
            },
            {
                groupName: 'public',
                subnetSelection: {
                    subnetType: SubnetType.PUBLIC
                },
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(80),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    },
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(443),
                        cidrs: [
                            AclCidr.anyIpv4()
                        ]
                    }
                ]
            },
            {
                groupName: 'public-internal',
                subnetSelection: {
                    subnetGroupName: 'public-internal-subnet',
                },
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(80),
                        cidrs: [
                            AclCidr.ipv4('140.198.16.0/21'),
                            AclCidr.ipv4('184.177.15.70/30')
                        ]
                    },
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(443),
                        cidrs: [
                            AclCidr.ipv4('140.198.16.0/21'),
                            AclCidr.ipv4('184.177.15.70/30')
                        ]
                    }
                ]
            },
            {
                groupName: 'private',
                subnetSelection: {
                    subnetType: SubnetType.PRIVATE_WITH_NAT
                },
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(80),
                        cidrs: [
                            AclCidr.anyIpv4(),
                            () => NaclCidr.vpcCidr()
                        ]
                    },
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(443),
                        cidrs: [
                            AclCidr.anyIpv4(),
                            () => NaclCidr.vpcCidr()
                        ]
                    }
                ]
            },
            {
                groupName: 'isolated',
                subnetSelection: {
                    subnetType: SubnetType.PRIVATE_ISOLATED
                },
                rules: [
                    {
                        direction: TrafficDirection.INGRESS,
                        traffic: AclTraffic.tcpPort(3306),
                        cidrs: [
                            AclCidr.ipv4("172.22.8.144/32")
                        ]
                    }
                ]
            },
        ];
        const helper = new NetworkAclHelper('172.19.0.0/16');
        const result = helper.create(naclRules);
        const expected = [
            {
                "name": "shared",
                "subnetSelection": {},
                "rules": [
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "172.22.160.0/24"
                            }
                        },
                        "ruleNumber": 5,
                        "traffic": {
                            "config": {
                                "protocol": 1,
                                "icmp": {
                                    "code": -1,
                                    "type": -1
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "172.22.161.0/24"
                            }
                        },
                        "ruleNumber": 10,
                        "traffic": {
                            "config": {
                                "protocol": 1,
                                "icmp": {
                                    "code": -1,
                                    "type": -1
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "10.150.0.0/22"
                            }
                        },
                        "ruleNumber": 15,
                        "traffic": {
                            "config": {
                                "protocol": 1,
                                "icmp": {
                                    "code": -1,
                                    "type": -1
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 20,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 1024,
                                    "to": 65535
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 25,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 53,
                                    "to": 53
                                }
                            }
                        },
                        "direction": 0
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 30,
                        "traffic": {
                            "config": {
                                "protocol": 17,
                                "portRange": {
                                    "from": 53,
                                    "to": 53
                                }
                            }
                        },
                        "direction": 0
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 35,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 0
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 40,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 0
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 45,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 1024,
                                    "to": 65535
                                }
                            }
                        },
                        "direction": 0
                    }
                ]
            },
            {
                "name": "public",
                "subnetSelection": {
                    "subnetType": "Public"
                },
                "rules": [
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 5,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 10,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 1
                    }
                ]
            },
            {
                "name": "public-internal",
                "subnetSelection": {
                    "subnetGroupName": "public-internal-subnet"
                },
                "rules": [
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "140.198.16.0/21"
                            }
                        },
                        "ruleNumber": 5,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "184.177.15.70/30"
                            }
                        },
                        "ruleNumber": 10,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "140.198.16.0/21"
                            }
                        },
                        "ruleNumber": 15,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "184.177.15.70/30"
                            }
                        },
                        "ruleNumber": 20,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 1
                    }
                ]
            },
            {
                "name": "private",
                "subnetSelection": {
                    "subnetType": "Private"
                },
                "rules": [
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 5,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "172.19.0.0/16"
                            }
                        },
                        "ruleNumber": 10,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 80,
                                    "to": 80
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "0.0.0.0/0"
                            }
                        },
                        "ruleNumber": 15,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 1
                    },
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "172.19.0.0/16"
                            }
                        },
                        "ruleNumber": 20,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 443,
                                    "to": 443
                                }
                            }
                        },
                        "direction": 1
                    }
                ]
            },
            {
                "name": "isolated",
                "subnetSelection": {
                    "subnetType": "Isolated"
                },
                "rules": [
                    {
                        "cidr": {
                            "config": {
                                "cidrBlock": "172.22.8.144/32"
                            }
                        },
                        "ruleNumber": 5,
                        "traffic": {
                            "config": {
                                "protocol": 6,
                                "portRange": {
                                    "from": 3306,
                                    "to": 3306
                                }
                            }
                        },
                        "direction": 1
                    }
                ]
            }
        ];
        expect(result).toMatchObject(expected);
    });
});