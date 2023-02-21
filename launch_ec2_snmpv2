import boto3

def lambda_handler(event, context):
    # Extract input values from the event object
    region = event['region']
    ami_id = event['ami-id']
    instance_type = event['instance-type']
    subnet_id = event['subnet-id']
    security_group_id = event['security-group-id']
    key_name = event['key-name']
    community_string = event['community-string']
    hostname = event['hostname']

    # Set up the user data script to configure SNMPv2
    user_data_script = f"""#!/bin/bash
        yum update -y
        yum install -y net-snmp net-snmp-utils
        mv /etc/snmp/snmpd.conf /etc/snmp/snmpd.conf.original
        sudo sh -c "echo 'rocommunity {community_string}' > /etc/snmp/snmpd.conf"
        systemctl enable snmpd
        systemctl start snmpd"""

    # Create EC2 client
    ec2 = boto3.client('ec2', region_name=region)

    # Launch the EC2 instance with the specified parameters
    response = ec2.run_instances(ImageId=ami_id, InstanceType=instance_type, MinCount=1, MaxCount=1,
                                 KeyName=key_name, UserData=user_data_script, SubnetId=subnet_id,
                                 SecurityGroupIds=[security_group_id])

    # Get the instance ID and public IP address of the launched instance
    instance_id = response['Instances'][0]['InstanceId']
    instance = ec2.describe_instances(InstanceIds=[instance_id])['Reservations'][0]['Instances'][0]
    public_ip_address = instance['PublicIpAddress']

    # Add a DNS record for the instance to resolve its hostname
    ssh_command = f"echo '{public_ip_address} {hostname}' | sudo tee -a /etc/hosts"
    os.system(f"ssh -i {os.environ['HOME']}/.ssh/id_rsa ec2-user@{public_ip_address} '{ssh_command}'")

    # Return a success message to the user
    return f"EC2 instance launched successfully with instance ID {instance_id} and public IP address {public_ip_address}"
