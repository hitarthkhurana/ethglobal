/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../common";
import type {
  ZKETAVerifier,
  ZKETAVerifierInterface,
} from "../../../../src/contracts/ETAVerifier.sol/ZKETAVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "proofHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "verifier",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProofVerified",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "verifiedProofs",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [
      {
        internalType: "contract Verifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "a",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[2][2]",
        name: "b",
        type: "uint256[2][2]",
      },
      {
        internalType: "uint256[2]",
        name: "c",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[6]",
        name: "input",
        type: "uint256[6]",
      },
    ],
    name: "verifyProof",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b506040516200137138038062001371833981810160405281019062000037919062000228565b33600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000ad5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000a491906200026b565b60405180910390fd5b620000be81620000fa60201b60201c565b508073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505062000288565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620001f082620001c3565b9050919050565b6200020281620001e3565b81146200020e57600080fd5b50565b6000815190506200022281620001f7565b92915050565b600060208284031215620002415762000240620001be565b5b6000620002518482850162000211565b91505092915050565b6200026581620001e3565b82525050565b60006020820190506200028260008301846200025a565b92915050565b6080516110c6620002ab6000396000818161014b01526102c501526110c66000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063176d80c4146100675780632b7ac3f314610097578063715018a6146100b55780638da5cb5b146100bf578063f2fde38b146100dd578063f398789b146100f9575b600080fd5b610081600480360381019061007c91906105c1565b610129565b60405161008e9190610609565b60405180910390f35b61009f610149565b6040516100ac91906106a3565b60405180910390f35b6100bd61016d565b005b6100c7610181565b6040516100d491906106df565b60405180910390f35b6100f760048036038101906100f29190610726565b6101aa565b005b610113600480360381019061010e9190610a32565b610230565b6040516101209190610609565b60405180910390f35b60016020528060005260406000206000915054906101000a900460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b610175610429565b61017f60006104b0565b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6101b2610429565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036102245760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161021b91906106df565b60405180910390fd5b61022d816104b0565b50565b6000808585858560405160200161024a9493929190610cc8565b6040516020818303038152906040528051906020012090506001600082815260200190815260200160002060009054906101000a900460ff16156102c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ba90610d73565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663f398789b878787876040518563ffffffff1660e01b81526004016103229493929190610f5a565b602060405180830381865afa15801561033f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103639190610fcd565b6103a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161039990611046565b60405180910390fd5b600180600083815260200190815260200160002060006101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff16817f3cbbb4765049102f7d16784aa5e5d53a1f94d5da6878a63974ffabb4989147d6426040516104149190611075565b60405180910390a36001915050949350505050565b610431610574565b73ffffffffffffffffffffffffffffffffffffffff1661044f610181565b73ffffffffffffffffffffffffffffffffffffffff16146104ae57610472610574565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016104a591906106df565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b6000604051905090565b600080fd5b6000819050919050565b61059e8161058b565b81146105a957600080fd5b50565b6000813590506105bb81610595565b92915050565b6000602082840312156105d7576105d6610586565b5b60006105e5848285016105ac565b91505092915050565b60008115159050919050565b610603816105ee565b82525050565b600060208201905061061e60008301846105fa565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061066961066461065f84610624565b610644565b610624565b9050919050565b600061067b8261064e565b9050919050565b600061068d82610670565b9050919050565b61069d81610682565b82525050565b60006020820190506106b86000830184610694565b92915050565b60006106c982610624565b9050919050565b6106d9816106be565b82525050565b60006020820190506106f460008301846106d0565b92915050565b610703816106be565b811461070e57600080fd5b50565b600081359050610720816106fa565b92915050565b60006020828403121561073c5761073b610586565b5b600061074a84828501610711565b91505092915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6107a182610758565b810181811067ffffffffffffffff821117156107c0576107bf610769565b5b80604052505050565b60006107d361057c565b90506107df8282610798565b919050565b600067ffffffffffffffff8211156107ff576107fe610769565b5b602082029050919050565b600080fd5b6000819050919050565b6108228161080f565b811461082d57600080fd5b50565b60008135905061083f81610819565b92915050565b6000610858610853846107e4565b6107c9565b905080602084028301858111156108725761087161080a565b5b835b8181101561089b57806108878882610830565b845260208401935050602081019050610874565b5050509392505050565b600082601f8301126108ba576108b9610753565b5b60026108c7848285610845565b91505092915050565b600067ffffffffffffffff8211156108eb576108ea610769565b5b602082029050919050565b6000610909610904846108d0565b6107c9565b905080604084028301858111156109235761092261080a565b5b835b8181101561094c578061093888826108a5565b845260208401935050604081019050610925565b5050509392505050565b600082601f83011261096b5761096a610753565b5b60026109788482856108f6565b91505092915050565b600067ffffffffffffffff82111561099c5761099b610769565b5b602082029050919050565b60006109ba6109b584610981565b6107c9565b905080602084028301858111156109d4576109d361080a565b5b835b818110156109fd57806109e98882610830565b8452602084019350506020810190506109d6565b5050509392505050565b600082601f830112610a1c57610a1b610753565b5b6006610a298482856109a7565b91505092915050565b6000806000806101c08587031215610a4d57610a4c610586565b5b6000610a5b878288016108a5565b9450506040610a6c87828801610956565b93505060c0610a7d878288016108a5565b925050610100610a8f87828801610a07565b91505092959194509250565b600060029050919050565b600081905092915050565b6000819050919050565b610ac48161080f565b82525050565b6000610ad68383610abb565b60208301905092915050565b6000602082019050919050565b610af881610a9b565b610b028184610aa6565b9250610b0d82610ab1565b8060005b83811015610b3e578151610b258782610aca565b9650610b3083610ae2565b925050600181019050610b11565b505050505050565b600060029050919050565b600081905092915050565b6000819050919050565b600081905092915050565b610b7a81610a9b565b610b848184610b66565b9250610b8f82610ab1565b8060005b83811015610bc0578151610ba78782610aca565b9650610bb283610ae2565b925050600181019050610b93565b505050505050565b6000610bd48383610b71565b60408301905092915050565b6000602082019050919050565b610bf681610b46565b610c008184610b51565b9250610c0b82610b5c565b8060005b83811015610c3c578151610c238782610bc8565b9650610c2e83610be0565b925050600181019050610c0f565b505050505050565b600060069050919050565b600081905092915050565b6000819050919050565b6000602082019050919050565b610c7a81610c44565b610c848184610c4f565b9250610c8f82610c5a565b8060005b83811015610cc0578151610ca78782610aca565b9650610cb283610c64565b925050600181019050610c93565b505050505050565b6000610cd48287610aef565b604082019150610ce48286610bed565b608082019150610cf48285610aef565b604082019150610d048284610c71565b60c08201915081905095945050505050565b600082825260208201905092915050565b7f50726f6f6620616c726561647920766572696669656400000000000000000000600082015250565b6000610d5d601683610d16565b9150610d6882610d27565b602082019050919050565b60006020820190508181036000830152610d8c81610d50565b9050919050565b600081905092915050565b610da78161080f565b82525050565b6000610db98383610d9e565b60208301905092915050565b610dce81610a9b565b610dd88184610d93565b9250610de382610ab1565b8060005b83811015610e14578151610dfb8782610dad565b9650610e0683610ae2565b925050600181019050610de7565b505050505050565b600081905092915050565b600081905092915050565b610e3b81610a9b565b610e458184610e27565b9250610e5082610ab1565b8060005b83811015610e81578151610e688782610dad565b9650610e7383610ae2565b925050600181019050610e54565b505050505050565b6000610e958383610e32565b60408301905092915050565b610eaa81610b46565b610eb48184610e1c565b9250610ebf82610b5c565b8060005b83811015610ef0578151610ed78782610e89565b9650610ee283610be0565b925050600181019050610ec3565b505050505050565b600081905092915050565b610f0c81610c44565b610f168184610ef8565b9250610f2182610c5a565b8060005b83811015610f52578151610f398782610dad565b9650610f4483610c64565b925050600181019050610f25565b505050505050565b60006101c082019050610f706000830187610dc5565b610f7d6040830186610ea1565b610f8a60c0830185610dc5565b610f98610100830184610f03565b95945050505050565b610faa816105ee565b8114610fb557600080fd5b50565b600081519050610fc781610fa1565b92915050565b600060208284031215610fe357610fe2610586565b5b6000610ff184828501610fb8565b91505092915050565b7f496e76616c69642070726f6f6600000000000000000000000000000000000000600082015250565b6000611030600d83610d16565b915061103b82610ffa565b602082019050919050565b6000602082019050818103600083015261105f81611023565b9050919050565b61106f8161080f565b82525050565b600060208201905061108a6000830184611066565b9291505056fea264697066735822122088b4ccbc030dc5153af75605f9c2341acb0e7fa94e8f4b15ca1f86f91009700d64736f6c63430008140033";

type ZKETAVerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ZKETAVerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ZKETAVerifier__factory extends ContractFactory {
  constructor(...args: ZKETAVerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _verifier: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_verifier, overrides || {});
  }
  override deploy(
    _verifier: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_verifier, overrides || {}) as Promise<
      ZKETAVerifier & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ZKETAVerifier__factory {
    return super.connect(runner) as ZKETAVerifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ZKETAVerifierInterface {
    return new Interface(_abi) as ZKETAVerifierInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ZKETAVerifier {
    return new Contract(address, _abi, runner) as unknown as ZKETAVerifier;
  }
}
