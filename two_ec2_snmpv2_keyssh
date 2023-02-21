import os
import boto3
from botocore.exceptions import ClientError

def launch_instances(event, context):
    # Extract input values from the event object
    region = event['region']
    ami_id = event['ami-id']
    instance_type = event['instance-type']
    subnet_id = event['subnet-id']
    security_group_id = event['security-group-id']
    community_string = event['community-string']
    hostname_1 = event['hostname-1']
    hostname_2 = event['hostname-2']
    key_pair_name = event['key_pair_name']

    # Generate a new RSA key pair
    ec2 = boto3.client('ec2', region_name=region)
    try:
        response = ec2.create_key_pair(KeyName=key_pair_name)
        private_key = response['KeyMaterial']
    except ClientError as e:
        return f"Error generating RSA key pair: {e.response['Error']['Message']}"

    # Set up the user data script to configure SNMPv2 and install the SSH public key
    user_data_script = f"""#!/bin/bash
        yum update -y
        yum install -y net-snmp net-snmp-utils
        echo "rocommunity {community_string}" >> /etc/snmp/snmpd.conf
        systemctl enable snmpd
        systemctl start snmpd
        mkdir -p /home/ec2-user/.ssh
        chmod 700 /home/ec2-user/.ssh
        echo "{private_key}" > /home/ec2-user/.ssh/id_rsa
        chmod 600 /home/ec2-user/.ssh/id_rsa
        echo "ssh-rsa {response['KeyMaterial']} aws-key" > /home/ec2-user/.ssh/authorized_keys
        chmod 600 /home/ec2-user/.ssh/authorized_keys
        chown -R ec2-user:ec2-user /home/ec2-user/.ssh"""

    # Create EC2 client
    ec2 = boto3.client('ec2', region_name=region)

    # Launch the EC2 instances with the specified parameters
    instances = ec2.run_instances(ImageId=ami_id, InstanceType=instance_type, MinCount=2, MaxCount=2,
                                  KeyName=key_pair_name, UserData=user_data_script, SubnetId=subnet_id,
                                  SecurityGroupIds=[security_group_id])

    # Get the instance IDs and public IP addresses of the launched instances
    instance_ids = [instance['InstanceId'] for instance in instances['Instances']]
    reservations = ec2.describe_instances(InstanceIds=instance_ids)['Reservations']
    public_ip_addresses = [instance['PublicIpAddress'] for reservation in reservations for instance in reservation['Instances']]

    # Add DNS records for the instances to resolve their hostnames
    ssh_command_1 = f"echo '{public_ip_addresses[0]} {hostname_1.lower()}' | sudo tee -a /etc/hosts"
    ssh_command_2 = f"echo '{public_ip_addresses[1]} {hostname_2.lower()}' | sudo tee -a /etc/hosts"
    os.system(f"ssh -i {os.environ['HOME']}/.ssh/{key_pair_name}.pem ec2-user@{public_ip_addresses[0]} '{ssh_command_1}'")
    os.system(f"ssh -i {os.environ['HOME']}/.ssh/{key_pair_name}.pem ec2-user@{public_ip_addresses[1]} '{ssh_command_2}'")

    # Get the private IP addresses of the launched instances
    private_ip_addresses = [instance['PrivateIpAddress'] for reservation in reservations for instance in reservation['Instances']]

    # Return a success message to the user
    return f"EC2 instances launched successfully with instance IDs {instance_ids}, public IP addresses {public_ip_addresses}, private IP addresses {private_ip_addresses}, and hostnames {hostname_1} and {hostname_2}."
