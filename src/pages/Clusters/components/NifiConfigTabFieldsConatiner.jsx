import React from 'react';
import { InputField, PasswordField, RadioSelectField } from '../../../shared';
import { TRUE_FALSE_OPTIONS } from '../../../constants';
import { NotePadIcon } from '../../../assets';
import PropTypes from 'prop-types';

const NifiConfigTabFieldsContainer = ({ register, errors, watch }) => {
  const inputObject = [
    {
      label: 'nifi.administrative.yield.duration',
      name: 'nifi_administrative_yield_duration',
      placeholder: 'Enter nifi.administrative.yield.duration',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.connection.model.implementation',
      name: 'nifi_analytics_connection_model_implementation',
      placeholder: 'Enter nifi.analytics.connection.model.implementation',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.connection.model.score.name',
      name: 'nifi_analytics_connection_model_score_name',
      placeholder: 'Enter nifi.analytics.connection.model.score.name',
      required: false,
      defaultValue: 50,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.connection.model.score.threshold',
      name: 'nifi_analytics_connection_model_score_threshold',
      placeholder: 'Enter nifi.analytics.connection.model.score.threshold',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.predict.enabled',
      name: 'nifi_analytics_predict_enabled',
      placeholder: 'Enter nifi.analytics.predict.enabled',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.predict.interval',
      name: 'nifi_analytics_predict_interval',
      placeholder: 'Enter nifi.analytics.predict.interval',
      required: false,
      defaultValue: 50,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.analytics.query.interval',
      name: 'nifi_analytics_query_interval',
      placeholder: 'Enter nifi.analytics.query.interval',
      required: false,
      defaultValue: 50,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.authorizer.configuration.file',
      name: 'nifi_authorizer_configuration_file',
      placeholder: 'Enter nifi.authorizer.configuration.file',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.bored.yield.duration',
      name: 'nifi_bored_yield_duration',
      placeholder: 'Enter nifi.bored.yield.duration',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.firewall.file',
      name: 'nifi_cluster_firewall_file',
      placeholder: 'Enter nifi.cluster.firewall.file',
      required: false,
      defaultValue: 50,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.flow.election.max.candidates',
      name: 'fi_cluster_flow_election_max_candidates',
      placeholder: 'Enter nifi.cluster.flow.election.max.candidates',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.flow.election.max.wait.time',
      name: 'nifi_cluster_flow_election_max_wait_time',
      placeholder: 'Enter nifi.cluster.flow.election.max.wait.time',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.is.node',
      name: 'nifi_cluster_is_node',
      placeholder: 'nifi.cluster.is.node',
      required: true,
      icon: <NotePadIcon />,
    },
    //
    {
      label: 'nifi.cluster.load.balance.comms.timeout',
      name: 'nifi_cluster_load_balance_comms_timeout',
      placeholder: 'Enter nifi.cluster.load.balance.comms.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.load.balance.connections.per.node',
      name: 'nifi_cluster_load_balance_connections_per_node',
      placeholder: 'Enter nifi.cluster.load.balance.connections.per.node',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.load.balance.host',
      name: 'nifi_cluster_load_balance_host',
      placeholder: 'Enter nifi.cluster.load.balance.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.load.balance.max.thread.count',
      name: 'nifi_cluster_load_balance_max_thread_count',
      placeholder: 'Enter nifi.cluster.load.balance.max.thread.count',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.load.balance.port',
      name: 'nifi_cluster_load_balance_port',
      placeholder: 'Enter nifi.cluster.load.balance.port',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.address',
      name: 'nifi_cluster_node_address',
      placeholder: 'Enter nifi.cluster.node.address',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.connection.timeout',
      name: 'nifi_cluster_node_connection_timeout',
      placeholder: 'Enter nifi.cluster.node.connection.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.event.history.size',
      name: 'nifi_cluster_node_event_history_size',
      placeholder: 'Enter nifi.cluster.node.event.history.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.max.concurrent.requests',
      name: 'nifi_cluster_node_max_concurrent_requests',
      placeholder: 'Enter nifi.cluster.node.max.concurrent.requests',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.protocol.max.threads',
      name: 'nifi_cluster_node_protocol_max_threads',
      placeholder: 'Enter nifi.cluster.node.protocol.max.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.protocol.port',
      name: 'nifi_cluster_node_protocol_port',
      placeholder: 'Enter nifi.cluster.node.protocol.port',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.protocol.threads',
      name: 'nifi_cluster_node_protocol_threads',
      placeholder: 'Enter nifi.cluster.node.protocol.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.node.read.timeout',
      name: 'nifi_cluster_node_read_timeout',
      placeholder: 'Enter nifi.cluster.node.read.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.protocol.heartbeat.interval',
      name: 'nifi_cluster_protocol_heartbeat_interval',
      placeholder: 'Enter nifi.cluster.protocol.heartbeat.interval',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.protocol.heartbeat.missable.max',
      name: 'nifi_cluster_protocol_heartbeat_missable_max',
      placeholder: 'Enter nifi.cluster.protocol.heartbeat.missable.max',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.cluster.protocol.is.secure',
      name: 'nifi_cluster_protocol_is_secure',
      placeholder: 'Enter nifi.cluster.protocol.is.secure',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.components.status.repository.buffer.size',
      name: 'nifi_components_status_repository_buffer_size',
      placeholder: 'Enter nifi.components.status.repository.buffer.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.components.status.repository.implementation',
      name: 'nifi_components_status_repository_implementation',
      placeholder: 'Enter nifi.components.status.repository.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.components.status.snapshot.frequency',
      name: 'nifi_components_status_snapshot_frequency',
      placeholder: 'Enter nifi.components.status.snapshot.frequency',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.claim.max.appendable.size',
      name: 'nifi_content_claim_max_appendable_size',
      placeholder: 'Enter nifi.content.claim.max.appendable.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.claim.max.flow.files',
      name: 'nifi_content_claim_max_flow_files',
      placeholder: 'Enter nifi.content.claim.max.flow.files',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.repository.archive.max.retention.period',
      name: 'nifi_content_repository_archive_max_retention_period',
      placeholder: 'Enter nifi.content.repository.archive.max.retention.period',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.repository.archive.max.usage.percentage',
      name: 'nifi_content_repository_archive_max_usage_percentage',
      placeholder: 'Enter nifi.content.repository.archive.max.usage.percentage',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.repository.directory.default',
      name: 'nifi_content_repository_directory_default',
      placeholder: 'Enter nifi.content.repository.directory.default',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.repository.implementation',
      name: 'nifi_content_repository_implementation',
      placeholder: 'Enter nifi.content.repository.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.content.viewer.url',
      name: 'nifi_content_viewer_url',
      placeholder: 'Enter nifi.content.viewer.url',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.database.directory',
      name: 'nifi_database_directory',
      placeholder: 'Enter nifi.database.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.documentation.working.directory',
      name: 'nifi_documentation_working_directory',
      placeholder: 'Enter nifi.documentation.working.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flow.configuration.archive.dir',
      name: 'nifi_flow_configuration_archive_dir',
      placeholder: 'Enter nifi.flow.configuration.archive.dir',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flow.configuration.archive.max.count',
      name: 'nifi_flow_configuration_archive_max_count',
      placeholder: 'Enter nifi.flow.configuration.archive.max.count',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flow.configuration.archive.max.storage',
      name: 'nifi_flow_configuration_archive_max_storage',
      placeholder: 'Enter nifi.flow.configuration.archive.max.storage',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flow.configuration.archive.max.time',
      name: 'nifi_flow_configuration_archive_max_time',
      placeholder: 'Enter nifi.flow.configuration.archive.max.time',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flow.configuration.file',
      name: 'nifi_flow_configuration_file',
      placeholder: 'Enter nifi.flow.configuration.file',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowcontroller.graceful.shutdown.period',
      name: 'nifi_flowcontroller_graceful_shutdown_period',
      placeholder: 'Enter nifi.flowcontroller.graceful.shutdown.period',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.checkpoint.interval',
      name: 'nifi_flowfile_repository_checkpoint_interval',
      placeholder: 'Enter nifi.flowfile.repository.checkpoint.interval',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.directory',
      name: 'nifi_flowfile_repository_directory',
      placeholder: 'Enter nifi.flowfile.repository.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.implementation',
      name: 'nifi_flowfile_repository_implementation',
      placeholder: 'Enter nifi.flowfile.repository.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.partitions',
      name: 'nifi_flowfile_repository_partitions',
      placeholder: 'Enter nifi.flowfile.repository.partitions',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.retain.orphaned.flowfiles',
      name: 'nifi_flowfile_repository_retain_orphaned_flowfiles',
      placeholder: 'Enter nifi.flowfile.repository.retain.orphaned.flowfiles',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowfile.repository.wal.implementation',
      name: 'nifi_flowfile_repository_wal_implementation',
      placeholder: 'Enter nifi.flowfile.repository.wal.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.flowservice.writedelay.interval',
      name: 'nifi_flowservice_writedelay_interval',
      placeholder: 'Enter nifi.flowservice.writedelay.interval',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.h2.url.append',
      name: 'nifi_h2_url_append',
      placeholder: 'Enter nifi.h2.url.append',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.krb5.file',
      name: 'nifi_kerberos_krb5_file',
      placeholder: 'Enter nifi.kerberos.krb5.file',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.service.keytab.location',
      name: 'nifi_kerberos_service_keytab_location',
      placeholder: 'Enter nifi.kerberos.service.keytab.location',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.service.principal',
      name: 'nifi_kerberos_service_principal',
      placeholder: 'Enter nifi.kerberos.service.principal',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.spnego.authentication.expiration',
      name: 'nifi_kerberos_spnego_authentication_expiration',
      placeholder: 'Enter nifi.kerberos.spnego.authentication.expiration',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.spnego.keytab.location',
      name: 'nifi_kerberos_spnego_keytab_location',
      placeholder: 'Enter nifi.kerberos.spnego.keytab.location',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.kerberos.spnego.principal',
      name: 'nifi_kerberos_spnego_principal',
      placeholder: 'Enter nifi.kerberos.spnego.principal',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.login.identity.provider.configuration.file',
      name: 'nifi_login_identity_provider_configuration_file',
      placeholder: 'Enter nifi.login.identity.provider.configuration.file',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.nar.library.autoload.directory',
      name: 'nifi_nar_library_autoload_directory',
      placeholder: 'Enter nifi.nar.library.autoload.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.nar.library.directory',
      name: 'nifi_nar_library_directory',
      placeholder: 'Enter nifi.nar.library.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.nar.working.directory',
      name: 'nifi_nar_working_directory',
      placeholder: 'Enter nifi.nar.working.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.buffer.size',
      name: 'nifi_provenance_repository_buffer_size',
      placeholder: 'Enter nifi.provenance.repository.buffer.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.concurrent.merge.threads',
      name: 'nifi_provenance_repository_concurrent_merge_threads',
      placeholder: 'Enter nifi.provenance.repository.concurrent.merge.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.debug.frequency',
      name: 'nifi_provenance_repository_debug_frequency',
      placeholder: 'Enter nifi.provenance.repository.debug.frequency',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.directory.default',
      name: 'nifi_provenance_repository_directory_default',
      placeholder: 'Enter nifi.provenance.repository.directory.default',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.encryption.key',
      name: 'nifi_provenance_repository_encryption_key',
      placeholder: 'Enter nifi.provenance.repository.encryption.key',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.encryption.key.id',
      name: 'nifi_provenance_repository_encryption_key_id',
      placeholder: 'Enter nifi.provenance.repository.encryption.key.id',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label:
        'nifi.provenance.repository.encryption.key.provider.implementation',
      name: 'nifi_provenance_repository_encryption_key_provider_implementation',
      placeholder:
        'Enter nifi.provenance.repository.encryption.key.provider.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.encryption.key.provider.location',
      name: 'nifi_provenance_repository_encryption_key_provider_location',
      placeholder:
        'Enter nifi.provenance.repository.encryption.key.provider.location',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.implementation',
      name: 'nifi_provenance_repository_implementation',
      placeholder: 'Enter nifi.provenance.repository.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.index.shard.size',
      name: 'nifi_provenance_repository_index_shard_size',
      placeholder: 'Enter nifi.provenance.repository.index.shard.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.index.threads',
      name: 'nifi_provenance_repository_index_threads',
      placeholder: 'Enter nifi.provenance.repository.index.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.indexed.attributes',
      name: 'nifi_provenance_repository_indexed_attributes',
      placeholder: 'Enter nifi.provenance.repository.indexed.attributes',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.indexed.fields',
      name: 'nifi_provenance_repository_indexed_fields',
      placeholder: 'Enter nifi.provenance.repository.indexed.fields',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.journal.count',
      name: 'nifi_provenance_repository_journal_count',
      placeholder: 'Enter nifi.provenance.repository.journal.count',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.max.attribute.length',
      name: 'nifi_provenance_repository_max_attribute_length',
      placeholder: 'Enter nifi.provenance.repository.max.attribute.length',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.max.storage.size',
      name: 'nifi_provenance_repository_max_storage_size',
      placeholder: 'Enter nifi.provenance.repository.max.storage.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.max.storage.time',
      name: 'nifi_provenance_repository_max_storage_time',
      placeholder: 'Enter nifi.provenance.repository.max.storage.time',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.query.threads',
      name: 'nifi_provenance_repository_query_threads',
      placeholder: 'Enter nifi.provenance.repository.query.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.rollover.size',
      name: 'nifi_provenance_repository_rollover_size',
      placeholder: 'Enter nifi.provenance.repository.rollover.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.rollover.time',
      name: 'nifi_provenance_repository_rollover_time',
      placeholder: 'Enter nifi.provenance.repository.rollover.time',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.provenance.repository.warm.cache.frequency',
      name: 'nifi_provenance_repository_warm_cache_frequency',
      placeholder: 'Enter nifi.provenance.repository.warm.cache.frequency',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.queue.backpressure.count',
      name: 'nifi_queue_backpressure_count',
      placeholder: 'Enter nifi.queue.backpressure.count',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.queue.backpressure.size',
      name: 'nifi_queue_backpressure_size',
      placeholder: 'Enter nifi.queue.backpressure.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.queue.swap.threshold',
      name: 'nifi_queue_swap_threshold',
      placeholder: 'Enter nifi.queue.swap.threshold',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.remote.contents.cache.expiration',
      name: 'nifi_remote_contents_cache_expiration',
      placeholder: 'Enter nifi.remote.contents.cache.expiration',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.remote.input.host',
      name: 'nifi_remote_input_host',
      placeholder: 'Enter nifi.remote.input.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.remote.input.http.transaction.ttl',
      name: 'nifi_remote_input_http_transaction_ttl',
      placeholder: 'Enter nifi.remote.input.http.transaction.ttl',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.remote.input.secure',
      name: 'nifi_remote_input_secure',
      placeholder: 'Enter nifi.remote.input.secure',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.remote.input.socket.port',
      name: 'nifi_remote_input_socket_port',
      placeholder: 'Enter nifi.remote.input.socket.port',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.allow.anonymous.authentication',
      name: 'nifi_security_allow_anonymous_authentication',
      placeholder: 'Enter nifi.security.allow.anonymous.authentication',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.group.mapping.pattern.anygroup',
      name: 'nifi_security_group_mapping_pattern_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.pattern.anygroup',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.group.mapping.transform.anygroup',
      name: 'nifi_security_group_mapping_transform_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.transform.anygroup',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.group.mapping.value.anygroup',
      name: 'nifi_security_group_mapping_value_anygroup',
      placeholder: 'Enter nifi.security.group.mapping.value.anygroup',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.pattern.dn',
      name: 'nifi_security_identity_mapping_pattern_dn',
      placeholder: 'Enter nifi.security.identity.mapping.pattern.dn',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.pattern.kerb',
      name: 'nifi_security_identity_mapping_pattern_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.pattern.kerb',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.transform.dn',
      name: 'nifi_security_identity_mapping_transform_dn',
      placeholder: 'Enter nifi.security.identity.mapping.transform.dn',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.transform.kerb',
      name: 'nifi_security_identity_mapping_transform_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.transform.kerb',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.value.dn',
      name: 'nifi_security_identity_mapping_value_dn',
      placeholder: 'Enter nifi.security.identity.mapping.value.dn',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.identity.mapping.value.kerb',
      name: 'nifi_security_identity_mapping_value_kerb',
      placeholder: 'Enter nifi.security.identity.mapping.value.kerb',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.keystore',
      name: 'nifi_security_keystore',
      placeholder: 'Enter nifi.security.keystore',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.keystoreType',
      name: 'nifi_security_keystoreType',
      placeholder: 'Enter nifi.security.keystoreType',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.ocsp.responder.certificate',
      name: 'nifi_security_ocsp_responder_certificate',
      placeholder: 'Enter nifi.security.ocsp.responder.certificate',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.ocsp.responder.url',
      name: 'nifi_security_ocsp_responder_url',
      placeholder: 'Enter nifi.security.ocsp.responder.url',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.truststore',
      name: 'nifi_security_truststore',
      placeholder: 'Enter nifi.security.truststore',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.truststoreType',
      name: 'nifi_security_truststoreType',
      placeholder: 'Enter nifi.security.truststoreType',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.authorizer',
      name: 'nifi_security_user_authorizer',
      placeholder: 'Enter nifi.security.user.authorizer',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.knox.audiences',
      name: 'nifi_security_user_knox_audiences',
      placeholder: 'Enter nifi.security.user.knox.audiences',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.knox.cookieName',
      name: 'nifi_security_user_knox_cookieName',
      placeholder: 'Enter nifi.security.user.knox.cookieName',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.knox.publicKey',
      name: 'nifi_security_user_knox_publicKey',
      placeholder: 'Enter nifi.security.user.knox.publicKey',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.knox.url',
      name: 'nifi_security_user_knox_url',
      placeholder: 'Enter nifi.security.user.knox.url',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.login.identity.provider',
      name: 'nifi_security_user_login_identity_provider',
      placeholder: 'Enter nifi.security.user.login.identity.provider',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.additional.scopes',
      name: 'nifi_security_user_oidc_additional_scopes',
      placeholder: 'Enter nifi.security.user.oidc.additional.scopes',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.claim.identifying.user',
      name: 'nifi_security_user_oidc_claim_identifying_user',
      placeholder: 'Enter nifi.security.user.oidc.claim.identifying.user',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.client.id',
      name: 'nifi_security_user_oidc_client_id',
      placeholder: 'Enter nifi.security.user.oidc.client.id',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.client.secret',
      name: 'nifi_security_user_oidc_client_secret',
      placeholder: 'Enter nifi.security.user.oidc.client.secret',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.connect.timeout',
      name: 'nifi_security_user_oidc_connect_timeout',
      placeholder: 'Enter nifi.security.user.oidc.connect.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.discovery.url',
      name: 'nifi_security_user_oidc_discovery_url',
      placeholder: 'Enter nifi.security.user.oidc.discovery.url',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.preferred.jwsalgorithm',
      name: 'nifi_security_user_oidc_preferred_jwsalgorithm',
      placeholder: 'Enter nifi.security.user.oidc.preferred.jwsalgorithm',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.security.user.oidc.read.timeout',
      name: 'nifi_security_user_oidc_read_timeout',
      placeholder: 'Enter nifi.security.user.oidc.read.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.sensitive.props.additional.keys',
      name: 'nifi_sensitive_props_additional_keys',
      placeholder: 'Enter nifi.sensitive.props.additional.keys',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.sensitive.props.algorithm',
      name: 'nifi_sensitive_props_algorithm',
      placeholder: 'Enter nifi.sensitive.props.algorithm',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.sensitive.props.key',
      name: 'nifi_sensitive_props_key',
      placeholder: 'Enter nifi.sensitive.props.key',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.state.management.configuration.file',
      name: 'nifi_state_management_configuration_file',
      placeholder: 'Enter nifi.state.management.configuration.file',
      required: false,
      icon: <NotePadIcon />,
    },

    {
      label: 'nifi.state.management.provider.cluster',
      name: 'nifi_state_management_provider_cluster',
      placeholder: 'Enter nifi.state.management.provider.cluster',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.state.management.provider.local',
      name: 'nifi_state_management_provider_local',
      placeholder: 'Enter nifi.state.management.provider.local',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.swap.in.period',
      name: 'nifi_swap_in_period',
      placeholder: 'Enter nifi.swap.in.period',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.swap.in.threads',
      name: 'nifi_swap_in_threads',
      placeholder: 'Enter nifi.swap.in.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.swap.manager.implementation',
      name: 'nifi_swap_manager_implementation',
      placeholder: 'Enter nifi.swap.manager.implementation',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.swap.out.period',
      name: 'nifi_swap_out_period',
      placeholder: 'Enter nifi.swap.out.period',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.swap.out.threads',
      name: 'nifi_swap_out_threads',
      placeholder: 'Enter nifi.swap.out.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.templates.directory',
      name: 'nifi_templates_directory',
      placeholder: 'Enter nifi.templates.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.ui.autorefresh.interval',
      name: 'nifi_ui_autorefresh_interval',
      placeholder: 'Enter nifi.ui.autorefresh.interval',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.ui.banner.text',
      name: 'nifi_ui_banner_text',
      placeholder: 'Enter nifi.ui.banner.text',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.variable.registry.properties',
      name: 'nifi_variable_registry_properties',
      placeholder: 'Enter nifi.variable.registry.properties',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.version',
      name: 'nifi_version',
      placeholder: 'Enter nifi.version',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.http.host',
      name: 'nifi_web_http_host',
      placeholder: 'Enter nifi.web.http.host',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.http.network.interface.default',
      name: 'nifi_web_http_network_interface_default',
      placeholder: 'Enter nifi.web.http.network.interface.default',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.http.port',
      name: 'nifi_web_http_port',
      placeholder: 'Enter nifi.web.http.port',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.https.host',
      name: 'nifi_web_https_host',
      placeholder: 'Enter nifi.web.https.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.https.network.interface.default',
      name: 'nifi_web_https_network_interface_default',
      placeholder: 'Enter nifi.web.https.network.interface.default',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.https.port',
      name: 'nifi_web_https_port',
      placeholder: 'Enter nifi.web.https.port',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.jetty.threads',
      name: 'nifi_web_jetty_threads',
      placeholder: 'Enter nifi.web.jetty.threads',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.jetty.working.directory',
      name: 'nifi_web_jetty_working_directory',
      placeholder: 'Enter nifi.web.jetty.working.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.max.content.size',
      name: 'nifi_web_max_content_size',
      placeholder: 'Enter nifi.web.max.content.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.max.header.size',
      name: 'nifi_web_max_header_size',
      placeholder: 'Enter nifi.web.max.header.size',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.max.requests.per.second',
      name: 'nifi_web_max_requests_per_second',
      placeholder: 'Enter nifi.web.max.requests.per.second',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.proxy.context.path',
      name: 'nifi_web_proxy_context_path',
      placeholder: 'Enter nifi.web.proxy.context.path',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.proxy.host',
      name: 'nifi_web_proxy_host',
      placeholder: 'Enter nifi.web.proxy.host',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.should.send.server.version',
      name: 'nifi_web_should_send_server_version',
      placeholder: 'Enter nifi.web.should.send.server.version',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.web.war.directory',
      name: 'nifi_web_war_directory',
      placeholder: 'Enter nifi.web.war.directory',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.zookeeper.connect.string',
      name: 'nifi_zookeeper_connect_string',
      placeholder: 'Enter nifi.zookeeper.connect.string',
      required: true,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.zookeeper.connect.timeout',
      name: 'nifi_zookeeper_connect_timeout',
      placeholder: 'Enter nifi.zookeeper.connect.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.zookeeper.root.node',
      name: 'nifi_zookeeper_root_node',
      placeholder: 'Enter nifi.zookeeper.root.node',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.zookeeper.session.timeout',
      name: 'nifi_zookeeper_session_timeout',
      placeholder: 'Enter nifi.zookeeper.session.timeout',
      required: false,
      icon: <NotePadIcon />,
    },
    {
      label: 'nifi.state.management.embedded.zookeeper.properties',
      name: 'nifi_state_management_embedded_zookeeper_properties',
      placeholder: 'Enter nifi.state.management.embedded.zookeeper.properties',
      required: false,
      icon: <NotePadIcon />,
    },
  ];

  // const selectObject = [
  //   {
  //     label: 'Flow Election Max Wait Time',
  //     name: 'nifi_cluster_flow_election_max_wait_time',
  //     icon: <QRIcons />,
  //     size: 'lg',
  //     options: FLOW_ELECTION_MAX_WAIT_OPTIONS,
  //     placeholder: 'Select Flow Election Max Wait Time',
  //     sortAlphabetically: false,
  //     defaultValue: '5',
  //     height: '54px',
  //     labelMargin: '0px',
  //   },
  //   {
  //     label: KDFM.NIFI_VERSION,
  //     name: 'nifiVersion',
  //     icon: <QRIcons />,
  //     required: false,
  //     options: [],
  //     placeholder: KDFM.SELECT_NIFI_VERSION,
  //     height: '54px',
  //     labelMargin: '0px',
  //   },
  // ];

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
        {/* {selectObject.map((select, index) => (
          <div className="col-4" key={index}>
            <StyledSelectField
              label={select.label}
              name={select.name}
              control={control}
              options={select.options}
              placeholder={select.placeholder}
              required={select.required}
              icon={select.icon}
              size={select.size}
              height={select.height}
              labelMargin={select.labelMargin}
              defaultValue={select.defaultValue}
              sortAlphabetically={select.sortAlphabetically}
              register={register}
              errors={errors}
            />
          </div>
        ))} */}
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
