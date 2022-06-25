export default {
    String: 'String',
    U8: 'U8',

    // --lib
    AccountId: 'String',
    /// Hash used by a struct implementing the Merkle tree.
    MerkleHash: 'CryptoHash',
    /// Validator identifier in current group.
    ValidatorId: 'u64',
    /// Mask which validators participated in multi sign.
    ValidatorMask: 'Vec<bool>',
    /// StorageUsage is used to count the amount of storage used by a contract.
    StorageUsage: 'u64',
    /// StorageUsageChange is used to count the storage usage within a single contract call.
    StorageUsageChange: 'i64',
    /// Nonce for transactions.
    Nonce: 'u64',
    /// Height of the block.
    BlockHeight: 'u64',
    /// Height of the epoch.
    EpochHeight: 'u64',
    /// Shard index, from 0 to NUM_SHARDS - 1.
    ShardId: 'u64',
    /// Balance is type for storing amounts of tokens.
    Balance: 'u128',
    /// Gas is a type for storing amount of gas.
    Gas: 'u64',

    /// Number of blocks in current group.
    NumBlocks: 'u64',
    /// Number of shards in current group.
    NumShards: 'u64',
    /// Number of seats of validators (block producer or hidden ones) in current group (settlement).
    NumSeats: 'u64',
    /// Block height delta that measures the difference between `BlockHeight`s.
    BlockHeightDelta: 'u64',

    GCCount: 'u64',

    ReceiptIndex: 'usize',
    PromiseId: 'Vec<ReceiptIndex>',

    ProtocolVersion: 'u32',
}