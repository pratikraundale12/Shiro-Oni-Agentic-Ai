import React from 'react';
import { InputField, PasswordField, RadioSelectField } from '../../../shared';
import { TRUE_FALSE_OPTIONS } from '../../../constants';
import { NotePadIcon } from '../../../assets';
import PropTypes from 'prop-types';

const NifiConfigTabFieldsContainer = ({ register, errors, watch }) => {
  const inputObject = [
    {
      label: 'nifi.administrative.yield.duration ',
      icon: <NotePadIcon />,
      name: 'nifi_administrative_yield_duration',
      placeholder: 'Enter nifi.administrative.yield.duration',
      required: true,
      description:
        'If a component allows an unexpected exception to escape, it is considered a bug. As a result, the framework will pause (or administratively yield) the component for this amount of time. This is done so that the component does not use up massive amounts of system resources, since it is known to have problems in the existing state. The default value is 30 sec.',
    },
    {
      label: 'nifi.analytics.connection.model.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_connection_model_implementation',
      placeholder: 'Enter nifi.analytics.connection.model.implementation',
      required: true,
      description:
        'This is the implementation class for the status analytics model used to make connection predictions.',
    },
    {
      label: 'nifi.web.https.port ',
      icon: <NotePadIcon />,
      name: 'nifi_web_https_port',
      placeholder: 'Enter nifi.web.https.port',
      required: true,
      description: 'The HTTPS port',
    },
    {
      label: 'nifi.cluster.node.protocol.port ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_protocol_port',
      placeholder: 'Enter nifi.cluster.node.protocol.port',
      required: true,
      description: 'The node protocol port',
    },
    {
      label: 'nifi.cluster.load.balance.port ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_load_balance_port',
      placeholder: 'Enter nifi.cluster.load.balance.port',
      required: false,
      description:
        'Specifies the port to listen on for incoming connections for load balancing data across the cluster. The default value is 6342.',
    },
    {
      label: 'nifi.cluster.load.balance.host ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_load_balance_host',
      placeholder: 'Enter nifi.cluster.load.balance.host',
      required: false,
      description:
        'Specifies the hostname to listen on for incoming connections for load balancing data across the cluster. If not specified, will default to the value used by the nifi.cluster.node.address property.',
    },
    {
      label: 'nifi.remote.input.http.transaction.ttl ',
      icon: <NotePadIcon />,
      name: 'nifi_remote_input_http_transaction_ttl',
      placeholder: 'Enter nifi.remote.input.http.transaction.ttl',
      required: true,
      description:
        'Specify how long a transaction can stay alive on server. If a Site-to-Site client didn’t proceed to next action for this period of time, the transaction is discarded from remote NiFi instance. For example, a client creates a transaction but doesn’t send or receive flow files, or send or received flow files but doesn’t confirm that transaction. By default, it is set to 30 seconds.',
    },
    {
      label: 'nifi.remote.input.secure ',
      icon: <NotePadIcon />,
      name: 'nifi_remote_input_secure',
      placeholder: 'Enter nifi.remote.input.secure',
      required: true,
      description:
        'This indicates whether communication between this instance of NiFi and remote NiFi instances should be secure. By default, it is set to true. In order for secure site-to-site to work, many Security Properties must also be configured.',
    },
    {
      label: 'nifi.remote.input.socket.port ',
      icon: <NotePadIcon />,
      name: 'nifi_remote_input_socket_port',
      placeholder: 'Enter nifi.remote.input.socket.port',
      required: true,
      description:
        'The remote input socket port for Site-to-Site communication. By default, it is blank, but it must have a value in order to use Remote Process Groups.',
    },
    {
      label: 'nifi.cluster.flow.election.max.wait.time ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_flow_election_max_wait_time',
      placeholder: 'Enter nifi.cluster.flow.election.max.wait.time',
      required: true,
      description:
        'Specifies the amount of time to wait before electing a Flow as the "correct" Flow. If the number of Nodes that have voted is equal to the number specified by the nifi.cluster.flow.election.max.candidates property, the cluster will not wait this long. The default is 5 minutes. Note that the time starts as soon as the first vote is cast.',
    },
    {
      label: 'nifi.cluster.is.node ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_is_node',
      placeholder: 'nifi.cluster.is.node',
      required: true,
      description: 'Whether the instance is a node in a cluster.',
    },
    {
      label: 'nifi.security.truststore ',
      icon: <NotePadIcon />,
      name: 'nifi_security_truststore',
      placeholder: 'Enter nifi.security.truststore',
      required: true,
      description:
        'The full path and name of the truststore. It is blank by default.',
    },
    {
      label: 'nifi.security.truststoreType ',
      icon: <NotePadIcon />,
      name: 'nifi_security_truststoreType',
      placeholder: 'Enter nifi.security.truststoreType',
      required: true,
      description: 'The truststore type. It is blank by default.',
    },
    {
      label: 'nifi.security.user.authorizer ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_authorizer',
      placeholder: 'Enter nifi.security.user.authorizer',
      required: true,
      description:
        'ID of one of the authorizers from authorizers.xml that will be the active authorizer used by NiFi. Can be set to file-authorizer or ranger-authorizer (or your own custom authorizer)',
    },
    {
      label: 'nifi.security.user.login.identity.provider ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_login_identity_provider',
      placeholder: 'Enter nifi.security.user.login.identity.provider',
      required: true,
      description:
        'This indicates what type of login identity provider to use. The default value is blank, can be set to the identifier from a provider in the file specified in nifi.login.identity.provider.configuration.file. Setting this property will trigger NiFi to support username/password authentication.',
    },
    {
      label: 'nifi.security.keystoreType ',
      icon: <NotePadIcon />,
      name: 'nifi_security_keystoreType',
      placeholder: 'Enter nifi.security.keystoreType',
      required: true,
      description: 'The keystore type. It is blank by default.',
    },
    {
      label: 'nifi.analytics.connection.model.score.name ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_connection_model_score_name',
      placeholder: 'Enter nifi.analytics.connection.model.score.name',
      required: false,
      defaultValue: 50,
      description:
        'This is the name of the scoring type that should be used to evaluate model.',
    },
    {
      label: 'nifi.analytics.connection.model.score.threshold ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_connection_model_score_threshold',
      placeholder: 'Enter nifi.analytics.connection.model.score.threshold',
      required: false,
      description:
        'This is the threshold for the scoring value (where model score should be above given threshold).',
    },
    {
      label: 'nifi.analytics.predict.enabled ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_predict_enabled',
      placeholder: 'Enter nifi.analytics.predict.enabled',
      required: false,
      description:
        'This indicates whether prediction should be enabled for the cluster.',
    },
    {
      label: 'nifi.analytics.predict.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_predict_interval',
      placeholder: 'Enter nifi.analytics.predict.interval',
      required: false,
      defaultValue: 50,
      description:
        'This indicates a time interval for which analytical predictions (queue saturation, e.g.) should be made',
    },
    {
      label: 'nifi.analytics.query.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_analytics_query_interval',
      placeholder: 'Enter nifi.analytics.query.interval',
      required: false,
      defaultValue: 50,
      description:
        'The time interval to query for past observations (e.g. the last 3 minutes of snapshots). The default value is 5 mins. NOTE: This value should be at least 3 times greater than nifi.components.status.snapshot.frequency to ensure enough observations are retrieved for predictions.',
    },
    {
      label: 'nifi.authorizer.configuration.file ',
      icon: <NotePadIcon />,
      name: 'nifi_authorizer_configuration_file',
      placeholder: 'Enter nifi.authorizer.configuration.file',
      required: false,
      description:
        'This is the location of the file that specifies how user access is authorized.',
    },
    {
      label: 'nifi.bored.yield.duration ',
      icon: <NotePadIcon />,
      name: 'nifi_bored_yield_duration',
      placeholder: 'Enter nifi.bored.yield.duration',
      required: false,
      description:
        'When a component has no work to do (i.e., is "bored"), this is the amount of time it will wait before checking to see if it has new data to work on. This way, it does not use up CPU resources by checking for new work too often. When setting this property, be aware that it could add extra latency for components that do not constantly have work to do, as once they go into this "bored" state, they will wait this amount of time before checking for more work. The default value is 10 millis.',
    },
    {
      label: 'nifi.cluster.firewall.file ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_firewall_file',
      placeholder: 'Enter nifi.cluster.firewall.file',
      required: false,
      defaultValue: 50,
      description:
        'The location of the node firewall file. This is a file that may be used to list all the nodes that are allowed to connect to the cluster. It provides an additional layer of security. This value is blank by default, meaning that no firewall file is to be used.',
    },
    {
      label: 'nifi.cluster.flow.election.max.candidates ',
      icon: <NotePadIcon />,
      name: 'fi_cluster_flow_election_max_candidates',
      placeholder: 'Enter nifi.cluster.flow.election.max.candidates',
      required: false,
      description:
        'Specifies the number of Nodes required in the cluster to cause early election of Flows.This allows the Nodes in the cluster to avoid having to wait a long time before starting processing if we reach at least this number of nodes in the cluster',
    },
    {
      label: 'nifi.cluster.load.balance.comms.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_load_balance_comms_timeout',
      placeholder: 'Enter nifi.cluster.load.balance.comms.timeout',
      required: false,
      description:
        'When communicating with another node, if this amount of time elapses without making any progress when reading from or writing to a socket, then a TimeoutException will be thrown. This will then result in the data either being retried or sent to another node in the cluster, depending on the configured Load Balancing Strategy. The default value is 30 sec.',
    },
    {
      label: 'nifi.cluster.load.balance.connections.per.node ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_load_balance_connections_per_node',
      placeholder: 'Enter nifi.cluster.load.balance.connections.per.node',
      required: false,
      description:
        'The maximum number of connections to create between this node and each other node in the cluster. For example, if there are 5 nodes in the cluster and this value is set to 4, there will be up to 20 socket connections established for load-balancing purposes (5 x 4 = 20). The default value is 4.',
    },
    {
      label: 'nifi.cluster.load.balance.max.thread.count ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_load_balance_max_thread_count',
      placeholder: 'Enter nifi.cluster.load.balance.max.thread.count',
      required: false,
      description:
        'The maximum number of threads to use for transferring data from this node to other nodes in the cluster. If this value is set to 8, for example, there will be up to 8 threads responsible for transferring data to other nodes, regardless of how many nodes are in the cluster. While a given thread can only write to a single socket at a time, a single thread is capable of servicing multiple connections simultaneously because a given connection may not be available for reading/writing at any given time. The default value is 8.',
    },
    {
      label: 'nifi.cluster.node.connection.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_connection_timeout',
      placeholder: 'Enter nifi.cluster.node.connection.timeout',
      required: false,
      description:
        'When connecting to another node in the cluster, specifies how long this node should wait before considering the connection a failure. The default value is 5 secs.',
    },
    {
      label: 'nifi.cluster.node.event.history.size ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_event_history_size',
      placeholder: 'Enter nifi.cluster.node.event.history.size',
      required: false,
      description:
        'When the state of a node in the cluster is changed, an event is generated and can be viewed in the Cluster page. This value indicates how many events to keep in memory for each node. The default value is 25.',
    },
    {
      label: 'nifi.cluster.node.max.concurrent.requests ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_max_concurrent_requests',
      placeholder: 'Enter nifi.cluster.node.max.concurrent.requests',
      required: false,
      description:
        'The maximum number of concurrent replicated web requests in the cluster.',
    },
    {
      label: 'nifi.cluster.node.protocol.max.threads ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_protocol_max_threads',
      placeholder: 'Enter nifi.cluster.node.protocol.max.threads',
      required: false,
      description: '',
    },
    {
      label: 'nifi.cluster.node.read.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_node_read_timeout',
      placeholder: 'Enter nifi.cluster.node.read.timeout',
      required: false,
      description:
        'When communicating with another node in the cluster, specifies how long this node should wait to receive information from the remote node before considering the communication with the node a failure. The default value is 5 secs.',
    },
    {
      label: 'nifi.cluster.protocol.heartbeat.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_protocol_heartbeat_interval',
      placeholder: 'Enter nifi.cluster.protocol.heartbeat.interval',
      required: false,
      description:
        'The interval at which nodes should emit heartbeats to the cluster manager. The default value is 5 sec.',
    },
    {
      label: 'nifi.cluster.protocol.heartbeat.missable.max ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_protocol_heartbeat_missable_max',
      placeholder: 'Enter nifi.cluster.protocol.heartbeat.missable.max',
      required: false,
      description:
        'Maximum number of heartbeats a Cluster Coordinator can miss for a node in the cluster before the Cluster Coordinator updates the node status to Disconnected. The default value is 8.',
    },
    {
      label: 'nifi.cluster.protocol.is.secure ',
      icon: <NotePadIcon />,
      name: 'nifi_cluster_protocol_is_secure',
      placeholder: 'Enter nifi.cluster.protocol.is.secure',
      required: false,
      description:
        'This indicates whether cluster communications are secure. The default value is false.',
    },
    {
      label: 'nifi.components.status.repository.buffer.size ',
      icon: <NotePadIcon />,
      name: 'nifi_components_status_repository_buffer_size',
      placeholder: 'Enter nifi.components.status.repository.buffer.size',
      required: false,
      description:
        'Specifies the buffer size for the Component Status Repository. The default value is 1440.',
    },
    {
      label: 'nifi.components.status.repository.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_components_status_repository_implementation',
      placeholder: 'Enter nifi.components.status.repository.implementation',
      required: false,
      description:
        'The Component Status Repository implementation. The default value is org.apache.nifi.controller.status.history.VolatileComponentStatusRepository and should not be changed.',
    },
    {
      label: 'nifi.components.status.snapshot.frequency ',
      icon: <NotePadIcon />,
      name: 'nifi_components_status_snapshot_frequency',
      placeholder: 'Enter nifi.components.status.snapshot.frequency',
      required: false,
      description:
        'This value indicates how often to present a snapshot of the components status history. The default value is 1 min',
    },
    {
      label: 'nifi.content.claim.max.appendable.size ',
      icon: <NotePadIcon />,
      name: 'nifi_content_claim_max_appendable_size',
      placeholder: 'Enter nifi.content.claim.max.appendable.size',
      required: false,
      description:
        'The maximum size for a content claim. The default value is 1 MB.',
    },
    {
      label: 'nifi.content.repository.archive.max.retention.period ',
      icon: <NotePadIcon />,
      name: 'nifi_content_repository_archive_max_retention_period',
      placeholder: 'Enter nifi.content.repository.archive.max.retention.period',
      required: false,
      description:
        'If archiving is enabled (see nifi.content.repository.archive.enabled below), then this property specifies the maximum amount of time to keep the archived data. It is 12 hours by default.',
    },
    {
      label: 'nifi.content.repository.archive.max.usage.percentage ',
      icon: <NotePadIcon />,
      name: 'nifi_content_repository_archive_max_usage_percentage',
      placeholder: 'Enter nifi.content.repository.archive.max.usage.percentage',
      required: false,
      description:
        'If archiving is enabled (see nifi.content.repository.archive.enabled), then this property also must have a value to indicate the maximum percentage of disk space that may be used before archive data is removed. If this value is already met even before archiving then arhival will not be of much use. It is 50% by default.',
    },
    {
      label: 'nifi.content.repository.directory.default ',
      icon: <NotePadIcon />,
      name: 'nifi_content_repository_directory_default',
      placeholder: 'Enter nifi.content.repository.directory.default',
      required: false,
      description:
        'The location of the Content Repository. NOTE: Multiple content repositories can be specified by using the nifi.content.repository.directory. prefix with unique suffixes and separate paths as values e.g. nifi.content.repository.directory.content1=/repos/content1',
    },
    {
      label: 'nifi.content.repository.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_content_repository_implementation',
      placeholder: 'Enter nifi.content.repository.implementation',
      required: false,
      description:
        'The Content Repository implementation. The default value is org.apache.nifi.controller.repository.FileSystemRepository and should not be changed.',
    },
    {
      label: 'nifi.content.viewer.url ',
      icon: <NotePadIcon />,
      name: 'nifi_content_viewer_url',
      placeholder: 'Enter nifi.content.viewer.url',
      required: false,
      description:
        'The URL for a web-based content viewer if one is available.',
    },
    {
      label: 'nifi.database.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_database_directory',
      placeholder: 'Enter nifi.database.directory',
      required: false,
      description:
        'The location of the H2 database directory. The H2 database keeps track of user access and flow controller history',
    },
    {
      label: 'nifi.documentation.working.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_documentation_working_directory',
      placeholder: 'Enter nifi.documentation.working.directory',
      required: false,
      description:
        'The documentation working directory. The default value should probably should be left as is.',
    },
    {
      label: 'nifi.flow.configuration.archive.dir ',
      icon: <NotePadIcon />,
      name: 'nifi_flow_configuration_archive_dir',
      placeholder: 'Enter nifi.flow.configuration.archive.dir',
      required: false,
      description:
        'The location of the archive directory where backup copies of the flow.xml are saved.',
    },
    {
      label: 'nifi.flow.configuration.archive.max.count ',
      icon: <NotePadIcon />,
      name: 'nifi_flow_configuration_archive_max_count',
      placeholder: 'Enter nifi.flow.configuration.archive.max.count',
      required: false,
      description:
        'The number of archive files allowed. NiFi will delete the oldest archive files so that only N latest archives can be kept, if this property is specified.',
    },
    {
      label: 'nifi.flow.configuration.archive.max.storage ',
      icon: <NotePadIcon />,
      name: 'nifi_flow_configuration_archive_max_storage',
      placeholder: 'Enter nifi.flow.configuration.archive.max.storage',
      required: false,
      description:
        'The total data size allowed for the archived flow.xml files. NiFi will delete the oldest archive files until the total archived file size becomes less than this configuration value. The default value is 500 MB.',
    },
    {
      label: 'nifi.flow.configuration.archive.max.time ',
      icon: <NotePadIcon />,
      name: 'nifi_flow_configuration_archive_max_time',
      placeholder: 'Enter nifi.flow.configuration.archive.max.time',
      required: false,
      description:
        'The lifespan of archived flow.xml files. NiFi will delete expired archive files when it updates flow.xml. Expiration is determined based on current system time and the last modified timestamp of an archived flow.xml. The default value is 30 days.',
    },
    {
      label: 'nifi.flow.configuration.file ',
      icon: <NotePadIcon />,
      name: 'nifi_flow_configuration_file',
      placeholder: 'Enter nifi.flow.configuration.file',
      required: false,
      description:
        'The location of the flow configuration file (i.e., the file that contains what is currently displayed on the NiFi graph).',
    },
    {
      label: 'nifi.flowcontroller.graceful.shutdown.period ',
      icon: <NotePadIcon />,
      name: 'nifi_flowcontroller_graceful_shutdown_period',
      placeholder: 'Enter nifi.flowcontroller.graceful.shutdown.period',
      required: false,
      description:
        'Indicates the shutdown period. The default value is 10 sec.',
    },
    {
      label: 'nifi.flowfile.repository.checkpoint.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_flowfile_repository_checkpoint_interval',
      placeholder: 'Enter nifi.flowfile.repository.checkpoint.interval',
      required: false,
      description:
        'The FlowFile Repository checkpoint interval. The default value is 2 mins.',
    },
    {
      label: 'nifi.flowfile.repository.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_flowfile_repository_directory',
      placeholder: 'Enter nifi.flowfile.repository.directory',
      required: false,
      description: 'The location of the FlowFile Repository.',
    },
    {
      label: 'nifi.flowfile.repository.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_flowfile_repository_implementation',
      placeholder: 'Enter nifi.flowfile.repository.implementation',
      required: false,
      description:
        'The FlowFile Repository implementation. The default value is org.apache.nifi.controller.repository.WriteAheadFlowFileRepository and should not be changed.',
    },
    {
      label: 'nifi.flowfile.repository.retain.orphaned.flowfiles ',
      icon: <NotePadIcon />,
      name: 'nifi_flowfile_repository_retain_orphaned_flowfiles',
      placeholder: 'Enter nifi.flowfile.repository.retain.orphaned.flowfiles',
      required: false,
      description:
        'Selects whether flowfile repository should keep orphaned flowfiles. Default is true',
    },
    {
      label: 'nifi.flowfile.repository.wal.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_flowfile_repository_wal_implementation',
      placeholder: 'Enter nifi.flowfile.repository.wal.implementation',
      required: false,
      description:
        ' If the repository implementation is configured to use the `WriteAheadFlowFileRepository`, this property can be used to specify which implementation of the Write-Ahead Log should be used. The default value is `org.apache.nifi.wali.SequentialAccessWriteAheadLog`. This version of the write-ahead log was added inversion 1.6.0 of Apache NiFi and was developed in order to address an issue that exists in the older implementation. In the event of power loss or an operating system crash, the old implementation was susceptible to recovering FlowFiles incorrectly. This could potentially lead to the wrong attributes or content being assigned to a FlowFile upon restart, following the power loss or OS crash. However, one can still choose to opt into using the previous implementation and accept that risk, if desired (for example, if the new implementation were to exhibit some unexpected error). To do so, set the value of this property to `org.wali.MinimalLockingWriteAheadLog`. If the value of this property is changed, upon restart, NiFi will still recover the records written using the previously configured repository and delete the files written by the previously configured implementation.',
    },
    {
      label: 'nifi.flowservice.writedelay.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_flowservice_writedelay_interval',
      placeholder: 'Enter nifi.flowservice.writedelay.interval',
      required: false,
      description:
        'When many changes are made to the flow.xml, this property specifies how long to wait before writing out the changes, so as to batch the changes into a single write. The default value is 500 ms.',
    },
    {
      label: 'nifi.kerberos.krb5.file ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_krb5_file',
      placeholder: 'Enter nifi.kerberos.krb5.file',
      required: false,
      description:
        'The location of the krb5 file, if used. It is blank by default. At this time, only a single krb5 file is allowed to be specified per NiFi instance, so this property is configured here to support SPNEGO and service principles rather than in individual Processors.  If necessary the krb5 file can support multiple realms.',
    },
    {
      label: 'nifi.kerberos.service.keytab.location ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_service_keytab_location',
      placeholder: 'Enter nifi.kerberos.service.keytab.location',
      required: false,
      description:
        'The file path of the NiFi Kerberos keytab, if used. It is blank by default. Note that this property is used to authenticate NiFi users',
    },
    {
      label: 'nifi.kerberos.service.principal ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_service_principal',
      placeholder: 'Enter nifi.kerberos.service.principal',
      required: false,
      description:
        'The name of the NiFi Kerberos service principal, if used. It is blank by default. Note that this property is used to authenticate NiFi users. Example: HTTP/nifi.example.com or HTTP/nifi.example.com@EXAMPLE.COM',
    },
    {
      label: 'nifi.kerberos.spnego.authentication.expiration ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_spnego_authentication_expiration',
      placeholder: 'Enter nifi.kerberos.spnego.authentication.expiration',
      required: false,
      description:
        'The expiration duration of a successful Kerberos user authentication, if used. It is 12 hours by default. Example: 12 hours',
    },
    {
      label: 'nifi.kerberos.spnego.keytab.location ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_spnego_keytab_location',
      placeholder: 'Enter nifi.kerberos.spnego.keytab.location',
      required: false,
      description:
        'The file path of the NiFi Spnego Kerberos keytab, if used. It is blank by default. Note that this property is used to authenticate NiFi users',
    },
    {
      label: 'nifi.kerberos.spnego.principal ',
      icon: <NotePadIcon />,
      name: 'nifi_kerberos_spnego_principal',
      placeholder: 'Enter nifi.kerberos.spnego.principal',
      required: false,
      description:
        'The name of the Spnego service principal, if used. It is blank by default. Note that this property is used to authenticate NiFi users. Example: HTTP/nifi.example.com or HTTP/nifi.example.com@EXAMPLE.COM',
    },
    {
      label: 'nifi.login.identity.provider.configuration.file ',
      icon: <NotePadIcon />,
      name: 'nifi_login_identity_provider_configuration_file',
      placeholder: 'Enter nifi.login.identity.provider.configuration.file',
      required: false,
      description:
        'This is the location of the file that specifies how username/password authentication is performed. This file is only consider if nifi.security.user.login.identity.provider configured with a provider identifier',
    },
    {
      label: 'nifi.nar.library.autoload.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_nar_library_autoload_directory',
      placeholder: 'Enter nifi.nar.library.autoload.directory',
      required: false,
      description: 'Directory with auto detect and loading for custom Nars',
    },
    {
      label: 'nifi.nar.library.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_nar_library_directory',
      placeholder: 'Enter nifi.nar.library.directory',
      required: false,
      description:
        'The location of the nar library. The default probably should be left as is but additional library directories can be specified by using the nifi.nar.library.directory. prefix with unique suffixes and separate paths as values e.g. nifi.nar.library.directory.lib1=/nars/lib1',
    },
    {
      label: 'nifi.nar.working.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_nar_working_directory',
      placeholder: 'Enter nifi.nar.working.directory',
      required: false,
      description:
        'The location of the nar working directory. The default value should probably should be left as is.',
    },
    {
      label: 'nifi.provenance.repository.buffer.size ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_buffer_size',
      placeholder: 'Enter nifi.provenance.repository.buffer.size',
      required: false,
      description:
        'The Provenance Repository buffer size. The default value is 100000.',
    },
    {
      label: 'nifi.provenance.repository.concurrent.merge.threads ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_concurrent_merge_threads',
      placeholder: 'Enter nifi.provenance.repository.concurrent.merge.threads',
      required: false,
      description:
        'Apache Lucene creates several "segments" in an Index. These segments are periodically merged together in order to provide faster querying. This property specifies the maximum number of threads that are allowed to be used for *each* of the storage directories. The default value is `2`. For high throughput environments, it is advisable to set the number of index threads larger than the number of merge threads * the number of storage locations. For example, if there are 2 storage locations and the number of index threads is set to 8, then the number of merge threads should likely be less than 4. While it is not critical that this be done, setting the number of merge threads larger than this can result in all index threads being used to merge, which would cause the NiFi flow to periodically pause while indexing is happening, resulting in some data being processed with much higher latency than other data.',
    },
    {
      label: 'nifi.provenance.repository.directory.default ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_directory_default',
      placeholder: 'Enter nifi.provenance.repository.directory.default',
      required: false,
      description:
        'The location of the Provenance Repository.NOTE: Multiple provenance repositories can be specified by using the nifi.provenance.repository.directory. prefix with unique suffixes and separate paths as values. For example, to provide two additional locations to act as part of the provenance repository, a user could also specify additional properties with keys of: nifi.provenance.repository.directory.provenance1=/repos/provenance1',
    },
    {
      label: 'nifi.provenance.repository.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_implementation',
      placeholder: 'Enter nifi.provenance.repository.implementation',
      required: false,
      description:
        'The Provenance Repository implementation. The default value is org.apache.nifi.provenance.WriteAheadProvenanceRepository and should not be changed.',
    },
    {
      label: 'nifi.provenance.repository.index.shard.size ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_index_shard_size',
      placeholder: 'Enter nifi.provenance.repository.index.shard.size',
      required: false,
      description:
        'Large values for the shard size will result in more Java heap usage when searching the Provenance Repository but should provide better performance. The default value is 500 MB.',
    },
    {
      label: 'nifi.provenance.repository.index.threads ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_index_threads',
      placeholder: 'Enter nifi.provenance.repository.index.threads',
      required: false,
      description:
        'The number of threads to use for indexing Provenance events so that they are searchable. The default value is 1. For flows that operate on a very high number of FlowFiles, the indexing of Provenance events could become a bottleneck. If this is the case, a bulletin will appear, indicating that "The rate of the dataflow is exceeding the provenance recording rate. Slowing down flow to accommodate." If this happens, increasing the value of this property may increase the rate at which the Provenance Repository is able to process these records, resulting in better overall throughput.',
    },
    {
      label: 'nifi.provenance.repository.indexed.attributes ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_indexed_attributes',
      placeholder: 'Enter nifi.provenance.repository.indexed.attributes',
      required: false,
      description:
        'This is a comma-separated list of FlowFile Attributes that should be indexed and made searchable. It is blank by default. But some good examples to consider are filename, uuid, and mime.type as well as any custom attritubes you might use which are valuable for your use case.',
    },
    {
      label: 'nifi.provenance.repository.indexed.fields ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_indexed_fields',
      placeholder: 'Enter nifi.provenance.repository.indexed.fields',
      required: false,
      description:
        'This is a comma-separated list of FlowFile Attributes that should be indexed and made searchable. It is blank by default. But some good examples to consider are filename, uuid, and mime.type as well as any custom attritubes you might use which are valuable for your use case.',
    },
    {
      label: 'nifi.provenance.repository.max.attribute.length ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_max_attribute_length',
      placeholder: 'Enter nifi.provenance.repository.max.attribute.length',
      required: false,
      description:
        'Indicates the maximum length that a FlowFile attribute can be when retrieving a Provenance Event from the repository. If the length of any attribute exceeds this value, it will be truncated when the event is retrieved. The default is 65536.',
    },
    {
      label: 'nifi.provenance.repository.max.storage.size ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_max_storage_size',
      placeholder: 'Enter nifi.provenance.repository.max.storage.size',
      required: false,
      description:
        'The maximum amount of data provenance information to store at a time. The default is 10 GB.',
    },
    {
      label: 'nifi.provenance.repository.max.storage.time ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_max_storage_time',
      placeholder: 'Enter nifi.provenance.repository.max.storage.time',
      required: false,
      description:
        'The maximum amount of time to keep data provenance information. The default value is 30 days.',
    },
    {
      label: 'nifi.provenance.repository.query.threads ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_query_threads',
      placeholder: 'Enter nifi.provenance.repository.query.threads',
      required: false,
      description:
        'The number of threads to use for Provenance Repository queries. The default value is 2.',
    },
    {
      label: 'nifi.provenance.repository.rollover.size ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_rollover_size',
      placeholder: 'Enter nifi.provenance.repository.rollover.size',
      required: false,
      description:
        'The amount of information to roll over at a time. The default value is 100 MB.',
    },
    {
      label: 'nifi.provenance.repository.rollover.time ',
      icon: <NotePadIcon />,
      name: 'nifi_provenance_repository_rollover_time',
      placeholder: 'Enter nifi.provenance.repository.rollover.time',
      required: false,
      description:
        'The amount of time to wait before rolling over the latest data provenance information so that it is available in the User Interface. The default value is 30 secs.',
    },
    {
      label: 'nifi.queue.backpressure.count ',
      icon: <NotePadIcon />,
      name: 'nifi_queue_backpressure_count',
      placeholder: 'Enter nifi.queue.backpressure.count',
      required: false,
      description:
        'When drawing a new connection between two components, this is the default value for that connection back pressure object threshold. The default is `10000` and the value must be an integer.',
    },
    {
      label: 'nifi.queue.backpressure.size ',
      icon: <NotePadIcon />,
      name: 'nifi_queue_backpressure_size',
      placeholder: 'Enter nifi.queue.backpressure.size',
      required: false,
      description:
        'When drawing a new connection between two components, this is the default value for that connection back pressure data size threshold. The default is `1 GB` and the value must be a data size including the unit of measure.',
    },
    {
      label: 'nifi.queue.swap.threshold ',
      icon: <NotePadIcon />,
      name: 'nifi_queue_swap_threshold',
      placeholder: 'Enter nifi.queue.swap.threshold',
      required: false,
      description:
        'The queue threshold at which NiFi starts to swap FlowFile information to disk. The default value is 20000.',
    },
    {
      label: 'nifi.remote.contents.cache.expiration ',
      icon: <NotePadIcon />,
      name: 'nifi_remote_contents_cache_expiration',
      placeholder: 'Enter nifi.remote.contents.cache.expiration',
      required: false,
      description:
        'Specifies how long NiFi should cache information about a remote NiFi instance when communicating via Site-to-Site. By default, NiFi will cache the responses from the remote system for 30 secs. This allows NiFi to avoid constantly making HTTP requests to the remote system, which is particularly important when this instance of NiFi has many instances of Remote Process Groups.',
    },
    {
      label: 'nifi.security.allow.anonymous.authentication ',
      icon: <NotePadIcon />,
      name: 'nifi_security_allow_anonymous_authentication',
      placeholder: 'Enter nifi.security.allow.anonymous.authentication',
      required: false,
      description:
        'Whether anonymous authentication is allowed when running over HTTPS. If set to true, client certificates are not required to connect via TLS.',
    },
    {
      label: 'nifi.security.group.mapping.pattern.anygroup ',
      icon: <NotePadIcon />,
      name: 'nifi_security_group_mapping_pattern_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.pattern.anygroup',
      required: false,
      description:
        'Sample pattern property to demonstrate normalizing group names. Create your own patterns using nifi.security.group.mapping.pattern.XXX convention. Sample pattern: ^(.*)$',
    },
    {
      label: 'nifi.security.group.mapping.transform.anygroup ',
      icon: <NotePadIcon />,
      name: 'nifi_security_group_mapping_transform_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.transform.anygroup',
      required: false,
      description:
        'Transform to apply to mapped group name for this mapping. Valid options are NONE, UPPER, and LOWER and defaults to NONE if not specified.',
    },
    {
      label: 'nifi.security.group.mapping.value.anygroup ',
      icon: <NotePadIcon />,
      name: 'nifi_security_group_mapping_value_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.value.anygroup',
      required: false,
      description:
        'Sample value property to demonstrate normalizing and transforming group names. Set values for your own patterns using nifi.security.group.mapping.value.XXX convention. Sample value: $1',
    },
    {
      label: 'nifi.security.identity.mapping.pattern.dn ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_pattern_dn',
      placeholder: 'Enter nifi.security.identity.mapping.pattern.dn',
      required: false,
      description:
        'Sample DN pattern property to demonstrate normalizing DNs from certificates into a common identity string. Create your own patterns using nifi.security.identity.mapping.pattern.XXX convention. Sample DN pattern: ^CN=(.*?), OU=(.*?), O=(.*?), L=(.*?), ST=(.*?), C=(.*?)$',
    },
    {
      label: 'nifi.security.identity.mapping.pattern.kerb ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_pattern_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.pattern.kerb',
      required: false,
      description:
        'Sample kerberos pattern property to demonstrate normalizing DNs from Kerberos principals into a common identity string. Create your own patterns using nifi.security.identity.mapping.pattern.XXX convention. Sample kerberos pattern: ^(.*?)/instance@(.*?)$',
    },
    {
      label: 'nifi.security.identity.mapping.transform.dn ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_transform_dn',
      placeholder: 'Enter nifi.security.identity.mapping.transform.dn',
      required: false,
      description:
        'Transform to apply to mapped identity for this mapping. Valid options are NONE, UPPER, and LOWER and defaults to NONE if not specified.',
    },
    {
      label: 'nifi.security.identity.mapping.transform.kerb ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_transform_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.transform.kerb',
      required: false,
      description:
        'Transform to apply to mapped identity for this mapping. Valid options are NONE, UPPER, and LOWER and defaults to NONE if not specified.',
    },
    {
      label: 'nifi.security.identity.mapping.value.dn ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_value_dn',
      placeholder: 'Enter nifi.security.identity.mapping.value.dn',
      required: false,
      description:
        'Sample DN value property to demonstrate normalizing DNs from certificates into a common identity string. Set values for your own patterns using nifi.security.identity.mapping.pattern.XXX convention. Sample DN value: $1@$2',
    },
    {
      label: 'nifi.security.identity.mapping.value.kerb ',
      icon: <NotePadIcon />,
      name: 'nifi_security_identity_mapping_value_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.value.kerb',
      required: false,
      description:
        'Sample kerberos value property to demonstrate normalizing DNs from Kerberos principals into a common identity string. Set values for your own patterns using nifi.security.identity.mapping.pattern.XXX convention. Sample kerberos value: $1@$2',
    },
    {
      label: 'nifi.security.keystore ',
      icon: <NotePadIcon />,
      name: 'nifi_security_keystore',
      placeholder: 'Enter nifi.security.keystore',
      required: false,
      description:
        'The full path and name of the keystore. It is blank by default.',
    },
    {
      label: 'nifi.security.ocsp.responder.certificate ',
      icon: <NotePadIcon />,
      name: 'nifi_security_ocsp_responder_certificate',
      placeholder: 'Enter nifi.security.ocsp.responder.certificate',
      required: false,
      description:
        'This is the location of the OCSP responder certificate if one is being used. It is blank by default.',
    },
    {
      label: 'nifi.security.ocsp.responder.url ',
      icon: <NotePadIcon />,
      name: 'nifi_security_ocsp_responder_url',
      placeholder: 'Enter nifi.security.ocsp.responder.url',
      required: false,
      description:
        'This is the URL for the Online Certificate Status Protocol (OCSP) responder if one is being used. It is blank by default.',
    },
    {
      label: 'nifi.security.user.knox.audiences ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_knox_audiences',
      placeholder: 'Enter nifi.security.user.knox.audiences',
      required: false,
      description:
        'Optional. A comma separate listed of allowed audiences. If set, the audience in the token must be present in this listing. The audience that is populated in the token can be configured in Knox.',
    },
    {
      label: 'nifi.security.user.knox.cookieName ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_knox_cookieName',
      placeholder: 'Enter nifi.security.user.knox.cookieName',
      required: false,
      description:
        'The name of the HTTP Cookie that Apache Knox will generate after successful log in.',
    },
    {
      label: 'nifi.security.user.knox.publicKey ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_knox_publicKey',
      placeholder: 'Enter nifi.security.user.knox.publicKey',
      required: false,
      description:
        'The path to the Apache Knox public key that will be used to verify the signatures of the authentication tokens in the HTTP Cookie.',
    },
    {
      label: 'nifi.security.user.knox.url ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_knox_url',
      placeholder: 'Enter nifi.security.user.knox.url',
      required: false,
      description: 'The URL for the Apache Knox log in page.',
    },
    {
      label: 'nifi.security.user.oidc.additional.scopes ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_additional_scopes',
      placeholder: 'Enter nifi.security.user.oidc.additional.scopes',
      required: false,
      description:
        'Comma separated scopes that are sent to OpenId Connect Provider in addition to openid and email',
    },
    {
      label: 'nifi.security.user.oidc.claim.identifying.user ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_claim_identifying_user',
      placeholder: 'Enter nifi.security.user.oidc.claim.identifying.user',
      required: false,
      description:
        'Claim that identifies the user to be logged in; default is email. May need to be requested via the nifi.security.user.oidc.additional.scopes before usage. by the OpenId Connect Provider according to the specification. If this value is HS256, HS384, or HS512, NiFi will attempt to validate HMAC protected tokens using the specified client secret. If this value is none, NiFi will attempt to validate unsecured/plain tokens. Other values for this algorithm will attempt to parse as an RSA or EC algorithm to be used in conjunction with the JSON Web Key (JWK) provided through the jwks_uri in the metadata found at the discovery URL.',
    },
    {
      label: 'nifi.security.user.oidc.client.id ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_client_id',
      placeholder: 'Enter nifi.security.user.oidc.client.id',
      required: false,
      description:
        'The client id for NiFi after registration with the OpenId Connect Provider.',
    },
    {
      label: 'nifi.security.user.oidc.client.secret ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_client_secret',
      placeholder: 'Enter nifi.security.user.oidc.client.secret',
      required: false,
      description:
        'The client secret for NiFi after registration with the OpenId Connect Provider.',
    },
    {
      label: 'nifi.security.user.oidc.connect.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_connect_timeout',
      placeholder: 'Enter nifi.security.user.oidc.connect.timeout',
      required: false,
      description:
        'Connect timeout when communicating with the OpenId Connect Provider.',
    },
    {
      label: 'nifi.security.user.oidc.discovery.url ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_discovery_url',
      placeholder: 'Enter nifi.security.user.oidc.discovery.url',
      required: false,
      description:
        'The discovery URL for the desired OpenId Connect Provider (http://openid.net/specs/openid-connect-discovery-1_0.html).',
    },
    {
      label: 'nifi.security.user.oidc.preferred.jwsalgorithm ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_preferred_jwsalgorithm',
      placeholder: 'Enter nifi.security.user.oidc.preferred.jwsalgorithm',
      required: false,
      description:
        'The preferred algorithm for for validating identity tokens. If this value is blank, it will default to RS256 which is required to be supported by the OpenId Connect Provider according to the specification. If this value is HS256, HS384, or HS512, NiFi will attempt to validate HMAC protected tokens using the specified client secret. If this value is none, NiFi will attempt to validate unsecured/plain tokens. Other values for this algorithm will attempt to parse as an RSA or EC algorithm to be used in conjunction with the JSON Web Key (JWK) provided through the jwks_uri in the metadata found at the discovery URL.',
    },
    {
      label: 'nifi.security.user.oidc.read.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_security_user_oidc_read_timeout',
      placeholder: 'Enter nifi.security.user.oidc.read.timeout',
      required: false,
      description:
        'Read timeout when communicating with the OpenId Connect Provider.',
    },
    {
      label: 'nifi.sensitive.props.additional.keys ',
      icon: <NotePadIcon />,
      name: 'nifi_sensitive_props_additional_keys',
      placeholder: 'Enter nifi.sensitive.props.additional.keys',
      required: false,
      description:
        'This is a comma delimited list of properties that should be encrypted when written to the nifi.properties files. Used when Encrypt Sensitive Configuration Properties is set to true.',
    },
    {
      label: 'nifi.sensitive.props.algorithm ',
      icon: <NotePadIcon />,
      name: 'nifi_sensitive_props_algorithm',
      placeholder: 'Enter nifi.sensitive.props.algorithm',
      required: false,
      description:
        'The algorithm used to encrypt sensitive properties. The default value is NIFI_PBKDF2_AES_GCM_256.',
    },
    {
      label: 'nifi.sensitive.props.key ',
      icon: <NotePadIcon />,
      name: 'nifi_sensitive_props_key',
      placeholder: 'Enter nifi.sensitive.props.key',
      required: false,
      description:
        'This is the password used to encrypt any sensitive property values that are configured in processors. By default, it is blank, but the system administrator should provide a value for it. It can be a string of any length, although the recommended minimum length is 10 characters. Be aware that once this password is set and one or more sensitive processor properties have been configured, this password should not be changed.',
    },
    {
      label: 'nifi.state.management.configuration.file ',
      icon: <NotePadIcon />,
      name: 'nifi_state_management_configuration_file',
      placeholder: 'Enter nifi.state.management.configuration.file',
      required: false,
      description:
        'The XML file that contains configuration for the local and cluster-wide State Providers.',
    },
    {
      label: 'nifi.state.management.provider.cluster ',
      icon: <NotePadIcon />,
      name: 'nifi_state_management_provider_cluster',
      placeholder: 'Enter nifi.state.management.provider.cluster',
      required: false,
      description:
        'The ID of the Cluster State Provider to use. This value must match the value of the id element of one of the cluster-provider elements in the state-management.xml file. This value is ignored if not clustered but is required for nodes in a cluster.',
    },
    {
      label: 'nifi.state.management.provider.local ',
      icon: <NotePadIcon />,
      name: 'nifi_state_management_provider_local',
      placeholder: 'Enter nifi.state.management.provider.local',
      required: false,
      description:
        'The property that provides the identifier of the local State Provider configured',
    },
    {
      label: 'nifi.swap.manager.implementation ',
      icon: <NotePadIcon />,
      name: 'nifi_swap_manager_implementation',
      placeholder: 'Enter nifi.swap.manager.implementation',
      required: false,
      description:
        'The Swap Manager implementation. The default value is org.apache.nifi.controller.FileSystemSwapManager and should not be changed.',
    },
    {
      label: 'nifi.templates.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_templates_directory',
      placeholder: 'Enter nifi.templates.directory',
      required: false,
      description:
        'This is the location of the directory where flow templates are saved.',
    },
    {
      label: 'nifi.ui.autorefresh.interval ',
      icon: <NotePadIcon />,
      name: 'nifi_ui_autorefresh_interval',
      placeholder: 'Enter nifi.ui.autorefresh.interval',
      required: false,
      description:
        'The interval at which the User Interface auto-refreshes. The default value is 30 sec.',
    },
    {
      label: 'nifi.ui.banner.text ',
      icon: <NotePadIcon />,
      name: 'nifi_ui_banner_text',
      placeholder: 'Enter nifi.ui.banner.text',
      required: false,
      description:
        'This is banner text that may be configured to display at the top of the User Interface. It is blank by default.',
    },
    {
      label: 'nifi.variable.registry.properties ',
      icon: <NotePadIcon />,
      name: 'nifi_variable_registry_properties',
      placeholder: 'Enter nifi.variable.registry.properties',
      required: false,
      description:
        'External properties files for variable registry. This field supports a comma delimited list of file locations',
    },
    {
      label: 'nifi.web.http.host ',
      icon: <NotePadIcon />,
      name: 'nifi_web_http_host',
      placeholder: 'Enter nifi.web.http.host',
      required: false,
      description: 'The HTTP host',
    },
    {
      label: 'nifi.web.http.network.interface.default ',
      icon: <NotePadIcon />,
      name: 'nifi_web_http_network_interface_default',
      placeholder: 'Enter nifi.web.http.network.interface.default',
      required: false,
      description:
        'The name of the network interface to which NiFi should bind for HTTP requests.',
    },
    {
      label: 'nifi.web.http.port ',
      icon: <NotePadIcon />,
      name: 'nifi_web_http_port',
      placeholder: 'Enter nifi.web.http.port',
      required: false,
      description: 'The HTTP port',
    },
    {
      label: 'nifi.web.https.network.interface.default ',
      icon: <NotePadIcon />,
      name: 'nifi_web_https_network_interface_default',
      placeholder: 'Enter nifi.web.https.network.interface.default',
      required: false,
      description:
        'The name of the network interface to which NiFi should bind for HTTPS requests. It is blank by default.',
    },
    {
      label: 'nifi.web.jetty.threads ',
      icon: <NotePadIcon />,
      name: 'nifi_web_jetty_threads',
      placeholder: 'Enter nifi.web.jetty.threads',
      required: false,
      description: 'The number of Jetty threads. The default value is 200.',
    },
    {
      label: 'nifi.web.jetty.working.directory ',
      icon: <NotePadIcon />,
      name: 'nifi_web_jetty_working_directory',
      placeholder: 'Enter nifi.web.jetty.working.directory',
      required: false,
      description: 'The location of the Jetty working directory.',
    },
    {
      label: 'nifi.web.max.content.size ',
      icon: <NotePadIcon />,
      name: 'nifi_web_max_content_size',
      placeholder: 'Enter nifi.web.max.content.size',
      required: false,
      description:
        'The maximum size (HTTP Content-Length) for PUT and POST requests. No default value is set for backward compatibility. Providing a value for this property enables the Content-Length filter on all incoming API requests (except Site-to-Site and cluster communications). A suggested value is 20 MB.',
    },
    {
      label: 'nifi.web.max.header.size ',
      icon: <NotePadIcon />,
      name: 'nifi_web_max_header_size',
      placeholder: 'Enter nifi.web.max.header.size',
      required: false,
      description:
        'The maximum size allowed for request and response headers. The default value is 16 KB.',
    },
    {
      label: 'nifi.web.max.requests.per.second ',
      icon: <NotePadIcon />,
      name: 'nifi_web_max_requests_per_second',
      placeholder: 'Enter nifi.web.max.requests.per.second',
      required: false,
      description:
        'The maximum number of requests from a connection per second. Requests in excess of this are first delayed, then throttled.',
    },
    {
      label: 'nifi.web.proxy.context.path ',
      icon: <NotePadIcon />,
      name: 'nifi_web_proxy_context_path',
      placeholder: 'Enter nifi.web.proxy.context.path',
      required: false,
      description:
        'A comma separated list of allowed HTTP X-ProxyContextPath or X-Forwarded-Context header values to consider. By default, this value is blank meaning all requests containing a proxy context path are rejected. Configuring this property would allow requests where the proxy path is contained in this listing.',
    },
    {
      label: 'nifi.web.should.send.server.version ',
      icon: <NotePadIcon />,
      name: 'nifi_web_should_send_server_version',
      placeholder: 'Enter nifi.web.should.send.server.version',
      required: false,
      description:
        'Selects whether Jetty server version is exposed in HTTP responses. Default is true',
    },
    {
      label: 'nifi.zookeeper.connect.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_zookeeper_connect_timeout',
      placeholder: 'Enter nifi.zookeeper.connect.timeout',
      required: false,
      description:
        'How long to wait when connecting to ZooKeeper before considering the connection a failure. The default is 3 secs.',
    },
    {
      label: 'nifi.zookeeper.root.node ',
      icon: <NotePadIcon />,
      name: 'nifi_zookeeper_root_node',
      placeholder: 'Enter nifi.zookeeper.root.node',
      required: false,
      description:
        'The root ZNode that should be used in ZooKeeper. ZooKeeper provides a directory-like structure for storing data. Each directory in this structure is referred to as a ZNode. This denotes the root ZNode, or directory, that should be used for storing data. The default value is /root. This is important to set correctly, as which cluster the NiFi instance attempts to join is determined by which ZooKeeper instance it connects to and the ZooKeeper Root Node that is specified.',
    },
    {
      label: 'nifi.zookeeper.session.timeout ',
      icon: <NotePadIcon />,
      name: 'nifi_zookeeper_session_timeout',
      placeholder: 'Enter nifi.zookeeper.session.timeout',
      required: false,
      description:
        'How long to wait after losing a connection to ZooKeeper before the session is expired. The default is 3 secs.',
    },
    {
      label: 'nifi.state.management.embedded.zookeeper.properties ',
      icon: <NotePadIcon />,
      name: 'nifi_state_management_embedded_zookeeper_properties',
      placeholder: 'Enter nifi.state.management.embedded.zookeeper.properties',
      required: false,
      description:
        'Specifies a properties file that contains the configuration for the embedded ZooKeeper Server (if started)',
    },
  ];

  const passwordObject = [
    {
      name: 'nifi_security_keyPasswd',
      label: 'nifi.security.keyPasswd',
      placeholder: 'Enter nifi.security.keyPasswd',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      name: 'nifi_security_keystorePasswd',
      label: 'nifi.security.keystorePasswd',
      placeholder: 'Enter nifi.security.keystorePasswd',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      name: 'nifi_security_truststorePasswd',
      label: 'nifi.security.truststorePasswd',
      placeholder: 'Enter nifi.security.truststorePasswd',
      required: true,
      icon: <NotePadIcon />,
    },
  ];
  const radioObjectArray = [
    {
      label: 'nifi.content.repository.always.sync',
      name: 'nifi_content_repository_always_sync',
    },
    {
      label: 'nifi.content.repository.archive.enabled',
      name: 'nifi_content_repository_archive_enabled',
    },
    {
      label: 'nifi.flow.configuration.archive.enabled',
      name: 'nifi.flow.configuration.archive.enabled',
    },
    {
      label: 'nifi.flowcontroller.autoResumeState',
      name: 'nifi.flowcontroller.autoResumeState',
    },

    {
      label: 'nifi.flowfile.repository.always.sync',
      name: 'nifi_flowfile_repository_always_sync',
    },
    {
      label: 'nifi.provenance.repository.always.sync',
      name: 'nifi_provenance_repository_always_sync',
    },
    {
      label: 'nifi.provenance.repository.compress.on.rollover',
      name: 'nifi_provenance_repository_compress_on_rollover',
    },
    {
      label: 'nifi.remote.input.http.enabled',
      name: 'nifi_remote_input_http_enabled',
    },
    {
      label: 'nifi.state.management.embedded.zookeeper.start',
      name: 'nifi_state_management_embedded_zookeeper_start',
    },
  ];

  return (
    <>
      <div className="row mt-3">
        {inputObject.map((input, index) => (
          <div className="col-6" key={index}>
            <InputField
              label={input.label}
              name={input.name}
              type="text"
              placeholder={input.placeholder}
              required={input.required}
              register={register}
              errors={errors}
              icon={input.icon}
            />
          </div>
        ))}
        {passwordObject.map((password, index) => (
          <div className="col-6" key={index}>
            <PasswordField
              label={password.label}
              name={password.name}
              placeholder={password.placeholder}
              required={password.required}
              register={register}
              errors={errors}
              icon={password.icon}
              watch={watch}
            />
          </div>
        ))}
        {radioObjectArray?.map(radio => (
          <div className="col-5" key={radio?.name}>
            <RadioSelectField
              name={radio?.name}
              options={TRUE_FALSE_OPTIONS}
              label={radio?.label}
              register={register}
              defaultValue={'false'}
            />
          </div>
        ))}
      </div>
    </>
  );
};
NifiConfigTabFieldsContainer.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
};
export default NifiConfigTabFieldsContainer;
