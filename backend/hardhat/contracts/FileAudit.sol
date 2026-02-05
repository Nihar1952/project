// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FileAudit
 * @dev Smart contract to immutably log file upload/download events
 */
contract FileAudit {
    struct AuditRecord {
        string fileId;
        string userId;
        string action;
        string cid;
        uint256 timestamp;
    }

    AuditRecord[] private records;

    event AuditLogged(
        uint256 index,
        string fileId,
        string userId,
        string action,
        string cid,
        uint256 timestamp
    );

    function logAudit(
        string memory fileId,
        string memory userId,
        string memory action,
        string memory cid
    ) public {
        AuditRecord memory record = AuditRecord(
            fileId,
            userId,
            action,
            cid,
            block.timestamp
        );

        records.push(record);

        emit AuditLogged(
            records.length - 1,
            fileId,
            userId,
            action,
            cid,
            block.timestamp
        );
    }

    function getRecordCount() public view returns (uint256) {
        return records.length;
    }

    function getRecord(uint256 index) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        uint256
    ) {
        AuditRecord memory r = records[index];
        return (r.fileId, r.userId, r.action, r.cid, r.timestamp);
    }
}
